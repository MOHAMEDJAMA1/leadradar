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

        // Defense-in-depth: Remove sensitive columns if they were somehow passed from client
        const safeUpdates = { ...updates }
        delete (safeUpdates as any).manual_scans_count
        delete (safeUpdates as any).manual_scans_reset_at
        delete (safeUpdates as any).ai_replies_count
        delete (safeUpdates as any).ai_replies_reset_at
        delete (safeUpdates as any).last_scan_at
        delete (safeUpdates as any).last_scan_summary

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
