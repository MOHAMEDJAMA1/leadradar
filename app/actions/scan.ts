'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { runScan } from '@/lib/services/reddit/scanner'
import type { ScanSummary } from '@/lib/services/reddit/types'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

const SCAN_RATE_LIMIT = 5 // max manual scans per hour
const ONE_HOUR_MS = 60 * 60 * 1000

export async function triggerScan(): Promise<{ success: boolean; data?: ScanSummary; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            logger.security('Manual scan attempt by unauthenticated user')
            return { success: false, error: 'Unauthorized' }
        }

        logger.info(`Manual scan execution started`, { userId: user.id })

        // 1. Enforce Rate Limits (standardized)
        const { checkRateLimit } = await import('@/lib/rate-limit')
        const { allowed, reset_at } = await checkRateLimit(user.id, 'scan', SCAN_RATE_LIMIT, ONE_HOUR_MS)

        if (!allowed) {
            logger.warn(`Rate limit reached for user during manual scan`, { userId: user.id })
            return {
                success: false,
                error: `Rate limit reached. You can trigger a maximum of ${SCAN_RATE_LIMIT} manual scans per hour. Next reset at ${reset_at.toLocaleTimeString()}.`
            }
        }

        // 2. Execute Scan
        const summary = await runScan(supabase, user.id)

        // 3. Update Last Scan Timestamp using Admin Client
        const adminSupabase = await createAdminClient()
        const now = new Date()
        await adminSupabase.from('user_settings')
            .update({
                last_scan_at: now.toISOString(),
                updated_at: now.toISOString()
            })
            .eq('user_id', user.id)

        logger.info(`Manual scan completed for user: ${user.id}`, {
            newLeads: (summary.reddit?.leadsDetected || 0) + (summary.twitter?.leadsDetected || 0),
            totalChecked: (summary.reddit?.postsChecked || 0) + (summary.twitter?.postsChecked || 0)
        })

        // Revalidate dashboard and leads pages so new data appears
        revalidatePath('/dashboard')
        revalidatePath('/leads')

        return { success: true, data: summary }
    } catch (error: any) {
        logger.error(`[Action] triggerScan error`, error)
        return { success: false, error: 'Internal server error while scanning' }
    }
}
