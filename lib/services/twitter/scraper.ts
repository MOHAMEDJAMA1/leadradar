import type { NormalizedPost } from '../reddit/types'

const NITTER_INSTANCES = [
    'https://nitter.net',
    'https://nitter.cz',
    'https://nitter.poast.org',
]

/**
 * Builds Twitter specific high-intent search queries based on the raw monitored keyword.
 */
export function buildTwitterSearchQueries(keyword: string): string[] {
    const prefixes = [
        'looking for',
        'need help with',
        'recommend',
        'agency needed',
        'developer needed',
    ]
    
    // We wrap searches in quotes to ensure phrase matching on X/Twitter
    return prefixes.map(prefix => `"${prefix} ${keyword}"`)
}

/**
 * Executes a search against a Nitter instance (Twitter open-source frontend)
 * to retrieve recent public posts without requiring API authentication.
 */
export async function scrapeTwitterSearch(query: string, maxResults: number = 20): Promise<NormalizedPost[]> {
    // Randomly pick an instance to avoid rate limits
    const instance = NITTER_INSTANCES[Math.floor(Math.random() * NITTER_INSTANCES.length)]
    const encodedQuery = encodeURIComponent(`${query} -filter:replies`)
    
    // Nitter exposes an RSS feed for any search query
    const url = `${instance}/search/rss?f=tweets&q=${encodedQuery}`

    try {
        const response = await fetch(url, {
            headers: {
                // Mimic a standard browser to prevent immediate blocking
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/rss+xml, application/xml, text/xml',
            },
            next: { revalidate: 300 } // cache for 5 minutes
        })

        if (!response.ok) {
            console.error(`[Twitter] Failed to fetch feed for query: ${query} on ${instance}`)
            return []
        }

        const xmlText = await response.text()
        
        return parseNitterRss(xmlText).slice(0, maxResults)
    } catch (e) {
        console.error(`[Twitter] Exception fetching feed for query: ${query}`, e)
        return []
    }
}

/**
 * MVP XML Parser that manually extracts RSS item elements.
 * Much lighter/faster than loading a heavy XML parser library like xml2js if we only need 4 fields.
 */
function parseNitterRss(xml: string): NormalizedPost[] {
    const posts: NormalizedPost[] = []
    
    // Quick regex to grab all <item>...</item> blocks
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemBlock = match[1]

        // Extract Title (Usually contains the Author in Nitter RSS: "AuthorName (@handle)")
        const titleMatch = itemBlock.match(/<title>([\s\S]*?)<\/title>/)
        const rawTitle = titleMatch ? titleMatch[1] : ''
        
        // Extract Description (The actual tweet content)
        // Nitter wraps the content in CDATA and HTML elements, we strip those.
        const descMatch = itemBlock.match(/<description>([\s\S]*?)<\/description>/)
        let content = descMatch ? descMatch[1] : ''
        
        // Strip HTML, CDATA, and decode entities
        content = content.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        content = content.replace(/<[^>]*>?/gm, '')
        content = content.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')

        // Extract Link
        const linkMatch = itemBlock.match(/<link>([\s\S]*?)<\/link>/)
        const url = linkMatch ? linkMatch[1] : ''

        // Extract pubDate
        const dateMatch = itemBlock.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
        const dateStr = dateMatch ? dateMatch[1] : ''

        // For Twitter, the parent_post_title is essentially the tweet itself since there's no "thread title"
        posts.push({
            externalId: url.split('/').pop() || Date.now().toString(), // URL slug acts as unique ID
            title: rawTitle,
            body: content.trim(),
            author: rawTitle.split(' (@')[0] || 'Unknown',
            subreddit: 'twitter', // We use subreddit as the literal source identifier or community map
            permalink: url,
            url: url,
            createdAt: dateStr ? new Date(dateStr) : new Date(),
            searchText: `${rawTitle} ${content}`.toLowerCase(),
        })
    }

    return posts
}
