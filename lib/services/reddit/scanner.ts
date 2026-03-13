import type { SupabaseClient } from '@supabase/supabase-js'
import type { ActiveKeyword, ScanSummary } from './types'
import { fetchSubredditPosts, fetchPostComments } from './fetcher'
import { scrapeTwitterSearch, buildTwitterSearchQueries } from '../twitter/scraper'
import { normalizePost, normalizeComment } from './normalizer'
import { matchKeywords, pickBestMatch } from './keywordMatcher'
import { scoreIntent, getRawScore, meetsThreshold, isMegathread, isThread } from './intentScorer'
import { persistLead } from './leadPersister'

const DEFAULT_SUBREDDITS = [
    'startups', 'entrepreneur', 'smallbusiness', 'ecommerce',
    'marketing', 'SaaS', 'PPC', 'freelance',
]

const POSTS_PER_SUBREDDIT = 25

import { isHotLead } from '@/types/leads'

/**
 * Main scanning orchestrator.
 * Runs the full pipeline: fetch → normalize → match → score → persist.
 */
export async function runScan(
    supabase: SupabaseClient,
    userId: string,
    createAlerts: boolean = false
): Promise<ScanSummary> {
    const startTime = Date.now()
    const summary: ScanSummary = {
        scannedCommunities: 0,
        postsChecked: 0,
        matchesFound: 0,
        leadsCreated: 0,
        leadsSkipped: 0,
        durationMs: 0,
        errors: [],
        reddit: {
            communitiesScanned: 0,
            postsChecked: 0,
            commentsChecked: 0,
            leadsDetected: 0,
        },
        twitter: {
            queriesExecuted: 0,
            postsChecked: 0,
            leadsDetected: 0,
        }
    }

    try {
        // ... (Skipping 1, 2, 3 as they are unchanged up to the loop)
        const { data: monitoredRows } = await supabase.from('user_monitored_communities').select('community_id, communities(id, name, source_id)').eq('user_id', userId)
        let communities: Array<{ id: string; name: string; source_id: string }> = []
        if (monitoredRows && monitoredRows.length > 0) {
            communities = monitoredRows.map((r: any) => r.communities).filter(Boolean)
        } else {
            const { data: defaultCommunities } = await supabase.from('communities').select('id, name, source_id').in('name', DEFAULT_SUBREDDITS)
            communities = defaultCommunities ?? []
        }
        if (communities.length === 0) {
            summary.errors.push('No communities found to scan')
            summary.durationMs = Date.now() - startTime
            return summary
        }

        const { data: redditSource } = await supabase.from('sources').select('id').eq('type', 'reddit').single()
        const sourceId = redditSource?.id ?? null
        // fallback to null if no source id mapping exists to prevent crash
        
        const { data: twitterSource } = await supabase.from('sources').select('id').eq('type', 'twitter').single()
        const twitterSourceId = twitterSource?.id ?? null

        const { data: keywordRows } = await supabase.from('tracked_keywords').select('id, keyword, category').eq('user_id', userId).eq('is_active', true)
        const keywords: ActiveKeyword[] = keywordRows ?? []
        if (keywords.length === 0) {
            summary.errors.push('No active keywords to match against')
            summary.durationMs = Date.now() - startTime
            return summary
        }

        for (const community of communities) {
            summary.scannedCommunities++
            if (summary.reddit) summary.reddit.communitiesScanned++

            const posts = await fetchSubredditPosts(community.name, POSTS_PER_SUBREDDIT)
            summary.postsChecked += posts.length
            if (summary.reddit) summary.reddit.postsChecked += posts.length

            for (const post of posts) {
                const normalized = normalizePost(post)

                if (normalized.searchText.length < 10) continue

                if (isMegathread(post.title)) {
                    summary.leadsSkipped++
                    continue
                }

                if (isThread(normalized.searchText)) {
                    summary.leadsSkipped++
                    continue
                }

                // --- Top Level Post Scanning ---
                const matches = matchKeywords(normalized.searchText, keywords)
                const bestMatch = pickBestMatch(matches)
                if (bestMatch) {
                    const rawScore = getRawScore(normalized.searchText)
                    if (meetsThreshold(rawScore)) {
                        summary.matchesFound++
                        const intent = scoreIntent(normalized.searchText, bestMatch.keywordPhrase, 'reddit', post.createdAt.toISOString())
                        const result = await persistLead(supabase, {
                            userId, post: normalized, match: bestMatch, intent, sourceId, communityId: community.id,
                        })

                        if (result.created) {
                            summary.leadsCreated++
                            if (summary.reddit) summary.reddit.leadsDetected++
                            if (createAlerts && result.leadId) {
                                const isHot = isHotLead({ intent_score_numeric: intent.score, intent_level: intent.level, match_reasons_json: intent.reasons } as any)
                                await supabase.from('alerts').insert({
                                    user_id: userId,
                                    lead_id: result.leadId,
                                    title: `${isHot ? '🔥' : '🔔'} New Reddit Lead`,
                                    message: normalized.title,
                                    type: isHot ? 'hot_lead' : 'new_lead'
                                })
                            }
                        } else {
                            summary.leadsSkipped++
                            if (result.error) summary.errors.push(`Persist error for post ${post.externalId}: ${result.error}`)
                        }
                    }
                }

                // --- Comment Scanning (Phase 5.6) ---
                const comments = await fetchPostComments(post.permalink, 10)
                if (summary.reddit) summary.reddit.commentsChecked += comments.length
                for (const comment of comments) {
                    const normComment = normalizeComment(comment, post)

                    if (normComment.searchText.length < 10) continue
                    if (isThread(normComment.searchText)) {
                        summary.leadsSkipped++
                        continue
                    }

                    const cMatches = matchKeywords(normComment.searchText, keywords)
                    const cBestMatch = pickBestMatch(cMatches)
                    if (!cBestMatch) continue

                    const cRawScore = getRawScore(normComment.searchText)
                    if (!meetsThreshold(cRawScore)) continue

                    summary.matchesFound++
                    const cIntent = scoreIntent(normComment.searchText, cBestMatch.keywordPhrase, 'reddit', comment.createdAt.toISOString())
                    const cResult = await persistLead(supabase, {
                        userId, post: normComment, match: cBestMatch, intent: cIntent, sourceId, communityId: community.id,
                    })

                    if (cResult.created) {
                        summary.leadsCreated++
                        if (summary.reddit) summary.reddit.leadsDetected++
                        if (createAlerts && cResult.leadId) {
                            const isHot = isHotLead({ intent_score_numeric: cIntent.score, intent_level: cIntent.level, match_reasons_json: cIntent.reasons } as any)
                            await supabase.from('alerts').insert({
                                user_id: userId,
                                title: `${isHot ? '🔥' : '🔔'} New Reddit Lead (Comment)`,
                                message: normComment.parentPostTitle || 'New comment match',
                                lead_id: cResult.leadId,
                                type: isHot ? 'hot_lead' : 'new_lead'
                            })
                        }
                    } else {
                        summary.leadsSkipped++
                        if (cResult.error) summary.errors.push(`Persist error for comment ${comment.id}: ${cResult.error}`)
                    }
                }
            }
        }

        // --- Phase 7: Twitter Scraping ---
        summary.scannedCommunities++ // Count "Twitter" as a 'community' block for analytics
        for (const kw of keywords) {
            const queries = buildTwitterSearchQueries(kw.keyword)
            
            // Limit to 2 queries per keyword on MVP to prevent rate limits
            for (const query of queries.slice(0, 2)) {
                if (summary.twitter) summary.twitter.queriesExecuted++
                const tweets = await scrapeTwitterSearch(query, 15) // fetch top 15 recent
                summary.postsChecked += tweets.length
                if (summary.twitter) summary.twitter.postsChecked += tweets.length
                
                for (const tweet of tweets) {
                    if (tweet.searchText.length < 10) continue
                    if (isThread(tweet.searchText)) {
                        summary.leadsSkipped++
                        continue
                    }

                    const matches = matchKeywords(tweet.searchText, [kw]) // Hard-bind to the exact keyword searched
                    const bestMatch = pickBestMatch(matches)

                    if (bestMatch) {
                        const rawScore = getRawScore(tweet.searchText)
                        if (meetsThreshold(rawScore)) {
                            summary.matchesFound++
                            const intent = scoreIntent(tweet.searchText, bestMatch.keywordPhrase, 'twitter', tweet.createdAt.toISOString())
                            
                            const result = await persistLead(supabase, {
                                userId, 
                                post: tweet, 
                                match: bestMatch, 
                                intent, 
                                sourceId: twitterSourceId || sourceId || '', 
                                communityId: communities[0]?.id || '' // Assign to first default community to satisfy schema
                            })

                            if (result.created) {
                                summary.leadsCreated++
                                if (summary.twitter) summary.twitter.leadsDetected++
                                if (createAlerts && result.leadId) {
                                    const isHot = isHotLead({ intent_score_numeric: intent.score, intent_level: intent.level, match_reasons_json: intent.reasons } as any)
                                    await supabase.from('alerts').insert({
                                        user_id: userId,
                                        lead_id: result.leadId,
                                        title: `${isHot ? '🔥' : '🔔'} New Twitter Lead`,
                                        message: tweet.title || (tweet.searchText.length > 50 ? tweet.searchText.slice(0, 50) + '...' : tweet.searchText),
                                        type: isHot ? 'hot_lead' : 'new_lead'
                                    })
                                }
                            } else {
                                summary.leadsSkipped++
                                if (result.error) summary.errors.push(`Persist error for tweet ${tweet.externalId}: ${result.error}`)
                            }
                        }
                    }
                }
            }
        }

    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        summary.errors.push(`Scan failed: ${message}`)
        console.error('[Scanner] Unexpected error:', err)
    }

    summary.durationMs = Date.now() - startTime

    // Persist completion state and stats (Phase 8)
    await supabase.from('user_settings').update({
        last_scan_at: new Date().toISOString(),
        last_scan_summary: summary
    }).eq('user_id', userId)

    return summary
}
