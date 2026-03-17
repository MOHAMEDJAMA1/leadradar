'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

import { cache } from 'react'
import { getAuthenticatedUser } from '@/lib/services/auth'

export const getUserSettings = cache(async () => {
    try {
        const supabase = await createClient()
        const user = await getAuthenticatedUser()

        if (!user) {
            logger.security('getUserSettings attempted without authentication')
            return { success: false, error: 'Unauthorized' }
        }

        // Fetch settings
        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error && error.code === 'PGRST116') { // not found
            const defaultSettings = {
                user_id: user.id,
                scan_frequency: '1h',
                email_alerts_enabled: true,
                onboarding_completed: false
            }

            const { data: newData, error: insertError } = await supabase
                .from('user_settings')
                .insert(defaultSettings)
                .select('*')
                .single()

            if (insertError) {
                // If another request created it in the meantime, just fetch it
                if (insertError.code === '23505') {
                    const { data: retryData, error: retryError } = await supabase
                        .from('user_settings')
                        .select('*')
                        .eq('user_id', user.id)
                        .single()
                    
                    if (retryError) throw retryError
                    return { success: true, settings: retryData }
                }
                throw insertError
            }
            return { success: true, settings: newData }
        }

        if (error) throw error
        return { success: true, settings: data }
    } catch (error: any) {
        logger.error('[getUserSettings] Error:', error)
        return { success: false, error: error.message }
    }
})

export async function updateUserSettings(updates: { 
    scan_frequency?: string; 
    email_alerts_enabled?: boolean;
    onboarding_completed?: boolean;
    last_scan_at?: string;
}) {
    let currentUser: any = null
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        currentUser = user

        if (!user) {
            logger.security('updateUserSettings attempted without authentication')
            return { success: false, error: 'Unauthorized' }
        }

        // 1. Input Validation & Sanitization
        const VALID_FREQUENCIES = ['1h', '6h', '12h', '24h', 'manual']
        if (updates.scan_frequency && !VALID_FREQUENCIES.includes(updates.scan_frequency)) {
            logger.security('Invalid scan frequency attempt', { userId: user.id, frequency: updates.scan_frequency })
            return { success: false, error: 'Invalid scan frequency' }
        }

        // 2. Defense-in-depth: Strict allow-list for client updates
        const safeUpdates: any = {}
        if (updates.scan_frequency !== undefined) safeUpdates.scan_frequency = updates.scan_frequency
        if (updates.email_alerts_enabled !== undefined) safeUpdates.email_alerts_enabled = !!updates.email_alerts_enabled
        if (updates.onboarding_completed !== undefined) safeUpdates.onboarding_completed = !!updates.onboarding_completed
        
        // NEVER allow direct updates to sensitive fields like count or last_scan

        let resultData

        const { data: updateData, error: updateError } = await supabase
            .from('user_settings')
            .update({ ...safeUpdates, updated_at: new Date().toISOString() })
            .eq('user_id', user.id)
            .select('*')

        if (updateError) throw updateError

        if (updateData && updateData.length > 0) {
            resultData = updateData[0]
        } else {
            const { data: insertData, error: insertError } = await supabase
                .from('user_settings')
                .insert({ user_id: user.id, ...updates, updated_at: new Date().toISOString() })
                .select('*')
                .single()

            if (insertError) throw insertError
            resultData = insertData
        }

        logger.info(`User settings updated for: ${user.id}`, updates)

        revalidatePath('/settings')
        return { success: true, settings: resultData }
    } catch (error: any) {
        logger.error(`[updateUserSettings] Error for user: ${currentUser?.id || 'unknown'}`, error)
        return { success: false, error: error.message }
    }
}
