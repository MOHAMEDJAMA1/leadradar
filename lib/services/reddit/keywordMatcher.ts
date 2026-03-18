import type { ActiveKeyword, KeywordMatch } from './types'

/**
 * Phase 4.7: Enhanced Keyword Matcher
 * Favors longer (more specific) phrases over short single keywords.
 * A match on "SEO agency" beats a match on just "SEO".
 * A match on "looking for SEO help" scores highest of all.
 */
export function matchKeywords(
    searchText: string,
    keywords: ActiveKeyword[]
): KeywordMatch[] {
    const matches: KeywordMatch[] = []
    const normalized = searchText.toLowerCase()

    // Phase 4.7: High-intent context phrases to boost specificity
    const HIGH_INTENT_CONTEXT = [
        'looking for', 'need help', 'hire', 'hiring', 'agency needed',
        'freelancer needed', 'expert needed', 'budget', 'recommend', 'seeking'
    ]

    for (const kw of keywords) {
        const phrase = kw.keyword.toLowerCase().trim()
        if (!phrase) continue

        if (normalized.includes(phrase)) {
            // Phase 4.7: Calculate specificity bonus
            // A keyword with multiple words is more specific and valuable
            const wordCount = phrase.split(/\s+/).length
            const specificityBonus = wordCount > 1 ? wordCount * 2 : 0

            // Context bonus: keyword appears near a high-intent phrase  
            const hasContext = HIGH_INTENT_CONTEXT.some(ctx => {
                if (!normalized.includes(ctx)) return false
                const phraseIndex = normalized.indexOf(phrase)
                const ctxIndex = normalized.indexOf(ctx)
                const dist = Math.abs(phraseIndex - ctxIndex)
                return dist < 80 // within ~80 characters of each other
            })
            const contextBonus = hasContext ? 5 : 0

            matches.push({
                keywordId: kw.id,
                keywordPhrase: kw.keyword,
                category: kw.category,
                matchScore: specificityBonus + contextBonus,
            })
        }
    }

    return matches
}

/**
 * Phase 4.7: Pick most specific + contextually relevant match.
 * Returns the keyword with the highest matchScore (specificity + context).
 */
export function pickBestMatch(matches: KeywordMatch[]): KeywordMatch | null {
    if (matches.length === 0) return null
    // Rank by matchScore (highest = most specific + most contextual)
    return matches.reduce((best, curr) =>
        (curr.matchScore ?? 0) > (best.matchScore ?? 0) ? curr : best
    )
}
