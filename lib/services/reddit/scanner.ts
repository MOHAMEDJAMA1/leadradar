import type { SupabaseClient } from '@supabase/supabase-js'
import type { ActiveKeyword, ScanSummary } from './types'
import { fetchSubredditPosts, fetchPostComments } from './fetcher'
import { scrapeTwitterSearch, buildTwitterSearchQueries } from '../twitter/scraper'
import { normalizePost, normalizeComment } from './normalizer'
import { matchKeywords, pickBestMatch } from './keywordMatcher'
import { scoreIntent, getRawScore, meetsThreshold, isMegathread, isThread } from './intentScorer'
import { persistLead } from './leadPersister'
import { isHotLead } from '@/types/leads'

const DEFAULT_SUBREDDITS = [
    'startups', 'entrepreneur', 'smallbusiness', 'ecommerce',
    'marketing', 'SaaS', 'PPC', 'freelance',
]

const POSTS_PER_SUBREDDIT = 25

/**
 * Main scanning orchestrator.
 * Runs the full pipeline: fetch → normalize → match → score → persist.
 * Optimised with parallel community processing.
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
        const { data: monitoredRows } = await supabase.from('user_monitored_communities')
            .select('community_id, communities(id, name, source_id)')
            .eq('user_id', userId)

        let communities: Array<{ id: string; name: string; source_id: string }> = []
        if (monitoredRows && monitoredRows.length > 0) {
            communities = monitoredRows.map((r: any) => r.communities).filter(Boolean)
        } else {
            const { data: defaultCommunities } = await supabase.from('communities')
                .select('id, name, source_id')
                .in('name', DEFAULT_SUBREDDITS)
            communities = defaultCommunities ?? []
        }

        if (communities.length === 0) {
            summary.errors.push('No communities found to scan')
            summary.durationMs = Date.now() - startTime
            return summary
        }

        const { data: redditSource } = await supabase.from('sources').select('id').eq('type', 'reddit').single()
        const sourceId = redditSource?.id ?? null
        
        const { data: twitterSource } = await supabase.from('sources').select('id').eq('type', 'twitter').single()
        const twitterSourceId = twitterSource?.id ?? null

        const { data: keywordRows } = await supabase.from('tracked_keywords')
            .select('id, keyword, category')
            .eq('user_id', userId)
            .eq('is_active', true)
        
        const keywords: ActiveKeyword[] = keywordRows ?? []
        if (keywords.length === 0) {
            summary.errors.push('No active keywords to match against')
            summary.durationMs = Date.now() - startTime
            return summary
        }

        // --- Reddit Parallel Scanning ---
        const redditPromises = communities.map(async (community) => {
            try {
                const posts = await fetchSubredditPosts(community.name, POSTS_PER_SUBREDDIT)
                summary.postsChecked += posts.length
                if (summary.reddit) {
                    summary.reddit.communitiesScanned++
                    summary.reddit.postsChecked += posts.length
                }

                for (const post of posts) {
                    const normalized = normalizePost(post)
                    if (normalized.searchText.length < 10) continue
                    if (isMegathread(post.title) || isThread(normalized.searchText)) {
                        summary.leadsSkipped++
                        continue
                    }

                    const matches = matchKeywords(normalized.searchText, keywords)
                    const bestMatch = pickBestMatch(matches)
                    if (bestMatch && meetsThreshold(getRawScore(normalized.searchText))) {
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
                        }
                    }

                    const comments = await fetchPostComments(post.permalink, 10)
                    if (summary.reddit) summary.reddit.commentsChecked += comments.length
                    for (const comment of comments) {
                        const normComment = normalizeComment(comment, post)
                        if (normComment.searchText.length < 10 || isThread(normComment.searchText)) continue

                        const cMatches = matchKeywords(normComment.searchText, keywords)
                        const cBestMatch = pickBestMatch(cMatches)
                        if (cBestMatch && meetsThreshold(getRawScore(normComment.searchText))) {
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
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(`Error scanning Reddit community ${community.name}:`, err)
            }
        })

        // --- Twitter Parallel Scanning ---
        const twitterPromises = keywords.map(async (kw) => {
            try {
                const queries = buildTwitterSearchQueries(kw.keyword)
                for (const query of queries.slice(0, 2)) {
                    if (summary.twitter) summary.twitter.queriesExecuted++
                    const tweets = await scrapeTwitterSearch(query, 15)
                    summary.postsChecked += tweets.length
                    if (summary.twitter) summary.twitter.postsChecked += tweets.length

                    for (const tweet of tweets) {
                        if (tweet.searchText.length < 10 || isThread(tweet.searchText)) continue
                        const matches = matchKeywords(tweet.searchText, [kw])
                        const bestMatch = pickBestMatch(matches)

                        if (bestMatch && meetsThreshold(getRawScore(tweet.searchText))) {
                            summary.matchesFound++
                            const intent = scoreIntent(tweet.searchText, bestMatch.keywordPhrase, 'twitter', tweet.createdAt.toISOString())
                            const result = await persistLead(supabase, {
                                userId, post: tweet, match: bestMatch, intent, sourceId: twitterSourceId || sourceId || '', communityId: communities[0]?.id || ''
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
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(`Error scanning Twitter for keyword ${kw.keyword}:`, err)
            }
        })

        await Promise.all([...redditPromises, ...twitterPromises])
        summary.scannedCommunities = communities.length + 1

    } catch (err) {
        summary.errors.push(`Scan failed: ${err instanceof Error ? err.message : String(err)}`)
    }

    summary.durationMs = Date.now() - startTime
    
    await supabase.from('user_settings').update({
        last_scan_at: new Date().toISOString(),
        last_scan_summary: summary
    }).eq('user_id', userId)

    return summary
}
