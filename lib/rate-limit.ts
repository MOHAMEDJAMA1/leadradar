import { createAdminClient } from '@/lib/supabase/server'
import { logEvent } from './logger'

export type RateLimitType = 'scan' | 'ai_reply'

interface RateLimitResult {
    allowed: boolean
    remaining: number
    reset_at: Date
}

/**
 * Checks and increments the rate limit for a specific user and action.
 * Uses the 'rate_limits' table in Supabase.
 */
export async function checkRateLimit(
    user_id: string,
    action_type: RateLimitType,
    limit: number,
    windowMs: number
): Promise<RateLimitResult> {
    const supabase = await createAdminClient()
    const now = new Date()
    
    // 1. Fetch current rate limit record
    const { data: record, error } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('user_id', user_id)
        .eq('action_type', action_type)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows found'
        console.error('Error fetching rate limit:', error)
        throw new Error('Rate limit check failed')
    }

    // 2. Determine if we need to reset or update
    let count = 0
    let resetAt = new Date(now.getTime() + windowMs)

    if (record) {
        const resetTime = new Date(record.reset_at)
        
        if (now < resetTime) {
            // Still in the same window
            count = record.count
            resetAt = resetTime
            
            if (count >= limit) {
                await logEvent({
                    level: 'security',
                    endpoint: `rate-limit:${action_type}`,
                    message: `Rate limit exceeded for ${action_type}`,
                    user_id
                })
                return { allowed: false, remaining: 0, reset_at: resetAt }
            }
        } else {
            // Window expired, reset count and set new reset time
            count = 0
            resetAt = new Date(now.getTime() + windowMs)
        }
    }

    // 3. Upsert the updated record
    const newCount = count + 1
    const { error: upsertError } = await supabase
        .from('rate_limits')
        .upsert({
            user_id,
            action_type,
            count: newCount,
            reset_at: resetAt.toISOString(),
            created_at: now.toISOString()
        })

    if (upsertError) {
        console.error('Error updating rate limit:', upsertError)
        throw new Error('Rate limit update failed')
    }

    return {
        allowed: true,
        remaining: limit - newCount,
        reset_at: resetAt
    }
}
