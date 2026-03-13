'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { updateUserSettings } from './settings'
import { triggerScan } from './scan'
import { logger } from '@/lib/logger'

export interface KeywordPack {
    keyword: string
    category: string
}

export interface OnboardingData {
    keywords: KeywordPack[]
    communities: string[]
}

export async function completeOnboarding(data: OnboardingData) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            logger.security('Onboarding completion attempted without authentication')
            throw new Error('Unauthorized')
        }

        logger.info(`Onboarding completion started for user: ${user.id}`, {
            keywordCount: data.keywords.length,
            communityCount: data.communities.length
        })

        // 1. Insert keywords
        if (data.keywords.length > 0) {
            const keywordRows = data.keywords.map(k => ({
                user_id: user.id,
                keyword: k.keyword,
                category: k.category,
                is_active: true
            }))
            
            await supabase.from('tracked_keywords').insert(keywordRows)
        }

        // 2. Insert communities (linking by name to source)
        if (data.communities.length > 0) {
            // First get the community IDs corresponding to the names
            const { data: dbCommunities } = await supabase
                .from('communities')
                .select('id, name')
                .in('name', data.communities)

            if (dbCommunities && dbCommunities.length > 0) {
                const monitoredRows = dbCommunities.map(c => ({
                    user_id: user.id,
                    community_id: c.id
                }))
                // Upsert to ignore duplicates if they re-run
                await supabase.from('user_monitored_communities').upsert(monitoredRows)
            }
        }

        // 3. Update User Settings to mark onboarding complete
        const updateResult = await updateUserSettings({ onboarding_completed: true })
        if (!updateResult.success) {
            throw new Error(`Failed to save onboarding completion: ${updateResult.error}`)
        }

        // 4. Invalidate all layouts before triggering scan to ensure
        // if anything breaks or hangs, at least the user is marked complete.
        revalidatePath('/', 'layout')

        // 5. Trigger initial background scan and await it
        await triggerScan()

        logger.info(`Onboarding completion successful for user: ${user.id}`)
        return { success: true }
    } catch (error: any) {
        logger.error(`[completeOnboarding] Error`, error)
        return { success: false, error: error.message }
    }
}
