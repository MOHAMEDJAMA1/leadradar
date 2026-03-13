import type { SupabaseClient } from '@supabase/supabase-js'
import type { NormalizedPost, KeywordMatch, IntentScore } from './types'
import { makeSnippet } from './normalizer'

interface PersistLeadOptions {
    userId: string
    post: NormalizedPost
    match: KeywordMatch
    intent: IntentScore & { lead_confidence?: string }
    sourceId: string
    communityId: string
}

interface PersistResult {
    created: boolean
    leadId?: string
    error?: string
}

/**
 * Persist a matched lead to Supabase.
 * Silently skips duplicates (unique constraint: user_id + external_post_id + matched_keyword).
 */
export async function persistLead(
    supabase: SupabaseClient,
    opts: PersistLeadOptions
): Promise<PersistResult> {
    const { userId, post, match, intent, sourceId, communityId } = opts
    const platform = post.subreddit === 'twitter' ? 'twitter' : 'reddit'

    // Phase 7.5: Duplicate Conversation Filtering
    // Sometimes a user will blast the exact same text across 5 different subreddits,
    // or Twitter syndication creates 5 different URLs for the exact same tweet text.
    // We check if we already saved a lead with this exact text from this exact author.
    // To prevent false positives on short text like "hello", we only do this for long text.
    if (post.body && post.body.length > 20) {
        // Find leads created in the last 24 hours for this platform
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        
        const { data: existingLeads } = await supabase
            .from('leads')
            .select('id, full_content')
            .eq('user_id', userId)
            .eq('platform', platform)
            .eq('author_name', post.author)
            .gte('created_at', oneDayAgo)

        if (existingLeads && existingLeads.length > 0) {
            // Strip out urls and non-alphanumeric chars for a fuzzy comparison
            const normalizeForCompare = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
            const newTextNormalized = normalizeForCompare(post.body)
            
            const isDuplicate = existingLeads.some(existing => {
                if (!existing.full_content) return false
                const oldTextNormalized = normalizeForCompare(existing.full_content)
                return oldTextNormalized.includes(newTextNormalized) || newTextNormalized.includes(oldTextNormalized)
            })

            if (isDuplicate) {
                return { created: false, error: 'Filtered out as chronological duplicate text' }
            }
        }
    }

    const leadRow = {
        user_id: userId,
        keyword_id: match.keywordId || null,
        source_id: sourceId,
        community_id: communityId,
        title: post.title,
        content_snippet: makeSnippet(post.body),
        full_content: post.body.slice(0, 2000) || null,
        author_name: post.author,
        source_url: post.permalink,
        external_post_id: post.externalId,
        matched_keyword: match.keywordPhrase,
        intent_score_numeric: intent.score,
        intent_level: intent.level,
        match_reasons_json: intent.reasons,
        status: 'new',
        detected_at: new Date().toISOString(),
        platform,
        lead_confidence: intent.lead_confidence || null,

        // Phase 5.6 Comment fields
        lead_type: post.isComment ? 'comment' : 'post',
        comment_text: post.isComment ? post.body : null,
        parent_post_title: post.isComment ? post.parentPostTitle : null,
        comment_url: post.isComment ? post.commentUrl : null,
        comment_id: post.isComment ? post.commentId : null,
    }

    const { data, error } = await supabase
        .from('leads')
        .insert(leadRow)
        .select('id')
        .single()

    if (error) {
        // Unique violation = duplicate — silently skip
        if (error.code === '23505') {
            return { created: false }
        }
        return { created: false, error: error.message }
    }

    return { created: true, leadId: data.id }
}
