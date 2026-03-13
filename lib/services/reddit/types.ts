// ─── Raw Reddit API response types ───────────────────────────────────────────

export interface RedditPostData {
    id: string
    title: string
    selftext: string
    author: string
    subreddit: string
    permalink: string
    url: string
    created_utc: number
    is_self: boolean
    score: number
    num_comments: number
}

export interface RedditApiResponse {
    data: {
        children: Array<{ data: RedditPostData }>
        after: string | null
    }
}

// ─── Normalized post (ready for matching) ────────────────────────────────────

export interface RedditPost {
    externalId: string
    title: string
    body: string
    author: string
    subreddit: string
    permalink: string
    url: string
    createdAt: Date
    comments?: RedditComment[]
}

export interface RedditComment {
    id: string
    body: string
    author: string
    permalink: string
    createdAt: Date
}

export interface NormalizedPost extends Omit<RedditPost, 'comments'> {
    /** lowercased title + body combined for matching */
    searchText: string

    // Phase 5.6: Comment fields
    isComment?: boolean
    commentId?: string
    parentPostTitle?: string
    commentUrl?: string
}

// ─── Keyword types ────────────────────────────────────────────────────────────

export interface ActiveKeyword {
    id: string
    keyword: string
    category: string | null
}

// ─── Matching & scoring ───────────────────────────────────────────────────────

export interface KeywordMatch {
    keywordId: string
    keywordPhrase: string
    category: string | null
}

export interface IntentScore {
    score: number
    level: 'high' | 'medium' | 'low'
    reasons: string[]
}

// ─── Lead candidate (matched post before DB write) ───────────────────────────

export interface LeadCandidate {
    post: NormalizedPost
    match: KeywordMatch
    intent: IntentScore
}

// ─── Scan summary ─────────────────────────────────────────────────────────────

export interface ScanSummary {
    scannedCommunities: number
    postsChecked: number
    matchesFound: number
    leadsCreated: number
    leadsSkipped: number   // duplicates
    durationMs: number
    errors: string[]

    // Phase 8: Per-source breakdowns
    reddit?: {
        communitiesScanned: number
        postsChecked: number
        commentsChecked: number
        leadsDetected: number
    }
    twitter?: {
        queriesExecuted: number
        postsChecked: number
        leadsDetected: number
    }
}
