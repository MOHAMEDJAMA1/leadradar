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

        logger.info(`Manual scan triggered by user: ${user.id}`)

        // 1. Enforce Rate Limits
        const { data: settings, error: settingsError } = await supabase
            .from('user_settings')
            .select('manual_scans_count, manual_scans_reset_at')
            .eq('user_id', user.id)
            .single()

        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError

        const now = new Date()
        const resetAt = settings?.manual_scans_reset_at ? new Date(settings.manual_scans_reset_at) : new Date(0)

        let newCount = settings?.manual_scans_count || 0
        let newResetAt = resetAt

        if (now > resetAt) {
            newCount = 0
            newResetAt = new Date(now.getTime() + ONE_HOUR_MS)
        }

        if (newCount >= SCAN_RATE_LIMIT) {
            logger.warn(`Rate limit reached for user ${user.id} during manual scan`)
            return {
                success: false,
                error: 'Rate limit reached. You can trigger a maximum of 5 manual scans per hour.'
            }
        }

        // 2. Execute Scan
        const summary = await runScan(supabase, user.id)

        // 3. Update Stats using Admin Client
        const adminSupabase = await createAdminClient()
        await adminSupabase.from('user_settings')
            .upsert({
                user_id: user.id,
                last_scan_at: now.toISOString(),
                manual_scans_count: newCount + 1,
                manual_scans_reset_at: newResetAt.toISOString(),
                updated_at: now.toISOString()
            })

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
