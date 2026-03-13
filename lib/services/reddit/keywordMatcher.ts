import type { ActiveKeyword, KeywordMatch } from './types'

/**
 * Match a post's normalized searchText against the user's active keywords.
 * Returns all matching keywords (supports multiple matches).
 * 
 * Uses simple phrase-contains matching — designed so it can later be
 * swapped for fuzzy or semantic matching without changing the interface.
 */
export function matchKeywords(
    searchText: string,
    keywords: ActiveKeyword[]
): KeywordMatch[] {
    const matches: KeywordMatch[] = []
    const normalized = searchText.toLowerCase()

    for (const kw of keywords) {
        const phrase = kw.keyword.toLowerCase().trim()
        if (!phrase) continue

        if (normalized.includes(phrase)) {
            matches.push({
                keywordId: kw.id,
                keywordPhrase: kw.keyword,
                category: kw.category,
            })
        }
    }

    return matches
}

/**
 * Pick the strongest match from multiple matches.
 * For MVP, returns the first (order from DB is by created_at desc).
 * Later: rank by keyword specificity or intent correlation.
 */
export function pickBestMatch(matches: KeywordMatch[]): KeywordMatch | null {
    if (matches.length === 0) return null
    // Prefer longer phrases (more specific) over shorter ones
    return matches.reduce((best, curr) =>
        curr.keywordPhrase.length > best.keywordPhrase.length ? curr : best
    )
}
