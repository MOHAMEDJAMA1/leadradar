import type { RedditPost, NormalizedPost, RedditComment } from './types'

/**
 * Normalize a Reddit post for keyword matching and intent scoring.
 * Lowercases title + body, combines into a single searchText string.
 */
export function normalizePost(post: RedditPost): NormalizedPost {
    const title = post.title.toLowerCase().trim()
    const body = post.body.toLowerCase().trim()

    // Combine with space; dedup redundant whitespace
    const searchText = `${title} ${body}`
        .replace(/\s+/g, ' ')
        .trim()

    return {
        ...post,
        searchText,
    }
}

/**
 * Extract a readable snippet from the body (max 280 chars).
 */
export function makeSnippet(body: string, maxLen = 280): string {
    if (!body || body === '[deleted]' || body === '[removed]') return ''
    const cleaned = body.replace(/\s+/g, ' ').trim()
    return cleaned.length > maxLen ? cleaned.slice(0, maxLen) + '…' : cleaned
}

/**
 * Normalize a Reddit comment into the NormalizedPost shape
 * so it can be processed by the exact same pipeline as posts.
 */
export function normalizeComment(comment: RedditComment, parentPost: RedditPost): NormalizedPost {
    const body = comment.body.toLowerCase().trim()

    // Comments don't have titles, so search text is just the body
    const searchText = body.replace(/\s+/g, ' ').trim()

    return {
        externalId: parentPost.externalId, // keeping relation
        title: parentPost.title, // Keep original title for context
        body: comment.body,
        author: comment.author,
        subreddit: parentPost.subreddit,
        permalink: parentPost.permalink, // fallback
        url: parentPost.url, // fallback
        createdAt: comment.createdAt,
        searchText,
        isComment: true,
        commentId: comment.id,
        parentPostTitle: parentPost.title,
        commentUrl: comment.permalink
    }
}
