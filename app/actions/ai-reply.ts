'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

const AI_REPLY_RATE_LIMIT = 5 // max replies per hour
const ONE_HOUR_MS = 60 * 60 * 1000
const MAX_OUTPUT_LENGTH = 500

export async function generateAiReply(leadId: string) {
    let currentUser: any = null
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        currentUser = user

        if (!user) {
            logger.security('AI reply attempt by unauthenticated user')
            return { success: false, error: 'Unauthorized' }
        }

        logger.info(`AI Reply generation requested by user ${user.id} for lead ${leadId}`)

        // 1. Enforce Rate Limits
        const { data: settings, error: settingsError } = await supabase
            .from('user_settings')
            .select('id, ai_replies_count, ai_replies_reset_at')
            .eq('user_id', user.id)
            .single()

        if (settingsError) throw settingsError

        const now = new Date()
        const resetAt = settings.ai_replies_reset_at ? new Date(settings.ai_replies_reset_at) : new Date(0)

        // Reset counter if time elapsed
        let newCount = settings.ai_replies_count || 0
        let newResetAt = resetAt

        if (now > resetAt) {
            newCount = 0
            newResetAt = new Date(now.getTime() + ONE_HOUR_MS)
        }

        if (newCount >= AI_REPLY_RATE_LIMIT) {
            logger.warn(`AI Rate limit hit for user ${user.id}`)
            return { success: false, error: 'Rate limit reached. You can generate a maximum of 5 replies per hour.' }
        }

        // 2. Fetch Lead Context
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .select(`
                *,
                communities(name)
            `)
            .eq('id', leadId)
            .eq('user_id', user.id)
            .single()

        if (leadError) throw leadError

        // 3. Pre-flight Eligibility Check
        const reasons = (lead.match_reasons_json as string[]) || []
        const hasNegativeSignals = reasons.some(r =>
            r === 'Story/Narrative detected' ||
            r === 'Advice/Discussion detected' ||
            r === 'discussion_signal_detected' ||
            r === 'story_signal_detected'
        )

        // Only allow AI reply generation for high-intent/Hot leads, non-discussion posts
        const isEligible = (lead.intent_level === 'high' || lead.lead_confidence === 'Hot') && !hasNegativeSignals

        if (!isEligible) {
            logger.warn(`AI Reply rejected: Lead ${leadId} is not eligible for user ${user.id}`)
            return {
                success: false,
                error: 'Lead is not eligible. AI replies are only available for high-intent service opportunities, not general discussions or stories.'
            }
        }

        // 4. Construct Prompt
        const prompt = `
You are writing a short, natural outreach reply for a business user responding to a public post.

Your job is NOT to answer the question like a general assistant.
Your job is to write a human, non-spammy reply only if the post looks like a real opportunity for someone offering services.

Rules:
- Length: STRICTLY under 500 characters
- Keep it short
- Sound natural
- Do not over-explain
- Do not act like a chatbot
- Do not provide a full expert answer
- Do not sound salesy
- Only suggest a reply if the post could realistically lead to a client conversation
- If the post is not a strong service opportunity, return exactly: NO_REPLY

User's service:
${lead.matched_keyword}

Post title:
${lead.parent_post_title || lead.title}

${lead.lead_type === 'comment'
                ? `Comment content (Reply directly to this context):\n${lead.comment_text || lead.full_content || lead.content_snippet}`
                : `Post content:\n${lead.full_content || lead.content_snippet}`}

Matched keyword:
${lead.matched_keyword}

Return either:
1. A short reply message
or
2. NO_REPLY
`

        // 5. Generate AI Text
        const { text } = await generateText({
            model: google('gemini-2.5-flash'),
            prompt,
            temperature: 0.4,
        })

        let trimmedReply = text.trim()

        // Hard cap on length
        if (trimmedReply.length > MAX_OUTPUT_LENGTH) {
            trimmedReply = trimmedReply.substring(0, MAX_OUTPUT_LENGTH) + '...'
        }

        if (trimmedReply === 'NO_REPLY') {
            logger.info(`AI Generation: Gemini returned NO_REPLY for lead ${leadId}`)
            return {
                success: false,
                error: 'The AI determined this post is not a strong enough service opportunity to warrant an outreach reply.'
            }
        }

        // 6. Save generated reply
        const { error: updateLeadError } = await supabase
            .from('leads')
            .update({
                ai_reply_generated: true,
                ai_reply_text: trimmedReply,
                ai_reply_created_at: new Date().toISOString()
            })
            .eq('id', leadId)

        if (updateLeadError) throw updateLeadError

        // 7. Increment usage count using Admin Client to bypass RLS/Trigger restrictions
        const adminSupabase = await createAdminClient()
        await adminSupabase
            .from('user_settings')
            .update({
                ai_replies_count: newCount + 1,
                ai_replies_reset_at: newResetAt.toISOString()
            })
            .eq('user_id', user.id)

        logger.info(`AI Reply successfully generated for lead ${leadId} (User: ${user.id})`)
        
        revalidatePath('/leads')
        return { success: true, replyText: trimmedReply }

    } catch (error: any) {
        logger.error(`[AI Reply Error] User: ${currentUser?.id || 'unknown'}`, error)
        return { success: false, error: 'Failed to generate reply' }
    }
}
