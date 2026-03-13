export interface DBLead {
    id: string
    title: string
    content_snippet: string | null
    full_content: string | null
    author_name: string | null
    source_url: string | null
    matched_keyword: string | null
    intent_score_numeric: number | null
    intent_level: 'high' | 'medium' | 'low' | null
    match_reasons_json: string[] | null
    status: 'new' | 'viewed' | 'saved' | 'contacted' | 'dismissed'
    detected_at: string | null
    created_at: string
    communities: { name: string } | null
    sources: { name: string } | null

    // Phase 5.6 Comment Fields
    lead_type?: 'post' | 'comment'
    comment_text?: string | null
    parent_post_title?: string | null
    comment_url?: string | null
    // Phase 7 Multi-Source Fields
    platform?: 'reddit' | 'twitter'

    // Phase 7.5 Quality Tuning
    lead_confidence?: 'Hot' | 'High' | 'Medium' | 'Low' | null

    // Phase 5.5 AI Fields
    ai_reply_generated?: boolean
    ai_reply_text?: string | null
    ai_reply_created_at?: string | null
}

/**
 * Centralized logic to determine if a lead is considered "HOT".
 * Phase 5.5 strictness constraints:
 * - numeric intent score > 85
 * - explicit "Hiring signal detected" OR "service_request_detected"
 * - NO "Story/Narrative detected", "Advice/Discussion detected", "discussion_signal_detected", or "story_signal_detected"
 */
export function isHotLead(lead: DBLead): boolean {
    // If we have the direct confidence label from Phase 7.5+, it is the source of truth.
    if (lead.lead_confidence) {
        return lead.lead_confidence === 'Hot'
    }

    // Fallback for older leads or leads where confidence wasn't persisted
    const score = lead.intent_score_numeric || 0
    if (score < 85) return false

    const reasons = lead.match_reasons_json || []

    // Must NOT contain discussion/story flags
    const hasNegativeSignals = reasons.some(r =>
        r === 'Story/Narrative detected' ||
        r === 'Advice/Discussion detected' ||
        r === 'discussion_signal_detected' ||
        r === 'story_signal_detected'
    )
    if (hasNegativeSignals) return false

    // Must explicitly contain a buying or service request signal
    const hasBuyingSignal = reasons.some(r =>
        r === 'Hiring signal detected' ||
        r === 'service_request_detected' ||
        r === 'High-Intent Phrase Detected' ||
        r === 'Proximity: Keyword near intent phrase'
    )
    if (!hasBuyingSignal) return false

    return true
}
