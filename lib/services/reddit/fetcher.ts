import type { RedditPost, RedditApiResponse, RedditComment } from './types'

const REDDIT_BASE = 'https://www.reddit.com'
const USER_AGENT = 'LeadRadar/1.0 (lead discovery tool; contact@leadradar.io)'

/**
 * Fetch the most recent posts from a subreddit using Reddit's public JSON API.
 * No authentication required for public subreddits.
 */
export async function fetchSubredditPosts(
    subreddit: string,
    limit = 25
): Promise<RedditPost[]> {
    const url = `${REDDIT_BASE}/r/${subreddit}/new.json?limit=${limit}&raw_json=1`

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json',
            },
            // Don't cache — we always want fresh posts
            cache: 'no-store',
            signal: AbortSignal.timeout(10_000), // 10s timeout per subreddit
        })

        if (!res.ok) {
            console.warn(`[RedditFetcher] ${subreddit}: HTTP ${res.status}`)
            return []
        }

        const json: RedditApiResponse = await res.json()

        return json.data.children.map(({ data }) => ({
            externalId: data.id,
            title: data.title,
            body: data.selftext ?? '',
            author: data.author,
            subreddit: data.subreddit,
            permalink: `${REDDIT_BASE}${data.permalink}`,
            url: data.url,
            createdAt: new Date(data.created_utc * 1000),
        }))
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`[RedditFetcher] Failed to fetch r/${subreddit}: ${message}`)
        return []
    }
}

/**
 * Fetch the top 10 comments from a specific Reddit post.
 */
export async function fetchPostComments(
    permalink: string, // should start with '/r/...'
    limit = 10
): Promise<RedditComment[]> {
    // Note: permalink usually includes trailing slash, e.g. /r/startups/comments/123/title/
    const url = `${REDDIT_BASE}${permalink.replace(/\/$/, '')}.json?limit=${limit}&depth=1&raw_json=1`

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json',
            },
            cache: 'no-store',
            signal: AbortSignal.timeout(5_000),
        })

        if (!res.ok) {
            console.warn(`[RedditFetcher] Comments HTTP ${res.status} for ${permalink}`)
            return []
        }

        const json = await res.json()

        // The Reddit API returns an array for post pages. 
        // json[0] is the post itself, json[1] contains the comments.
        if (!Array.isArray(json) || json.length < 2) return []

        const commentsData = json[1]?.data?.children || []

        return commentsData
            .filter((child: any) => child.kind === 't1') // ensure it's a comment
            .map(({ data }: any) => ({
                id: data.id,
                body: data.body ?? '',
                author: data.author,
                permalink: `${REDDIT_BASE}${data.permalink}`,
                createdAt: new Date(data.created_utc * 1000),
            }))
    } catch (err) {
        // Quietly fail for comment fetches to not overwhelm the scanner logs
        return []
    }
}
