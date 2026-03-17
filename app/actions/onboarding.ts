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

        // 1. Input Validation & Sanitization
        const sanitizedKeywords = data.keywords
            .filter(k => k.keyword && k.keyword.trim().length > 0)
            .map(k => ({
                user_id: user.id,
                keyword: k.keyword.trim().toLowerCase(),
                category: k.category.trim() || 'General',
                is_active: true
            }))
            .slice(0, 50) // Absolute cap for safety

        const sanitizedCommunities = data.communities
            .filter(c => c && c.trim().length > 0)
            .map(c => c.trim())
            .slice(0, 50) // Absolute cap for safety

        // 2. Insert keywords
        if (sanitizedKeywords.length > 0) {
            await supabase.from('tracked_keywords').insert(sanitizedKeywords)
        }

        // 3. Insert communities (linking by name to source)
        if (sanitizedCommunities.length > 0) {
            const { data: dbCommunities } = await supabase
                .from('communities')
                .select('id, name')
                .in('name', sanitizedCommunities)

            if (dbCommunities && dbCommunities.length > 0) {
                const monitoredRows = dbCommunities.map(c => ({
                    user_id: user.id,
                    community_id: c.id
                }))
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
