'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUnreadAlertsCount() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, count: 0 }

        const { count, error } = await supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false)

        if (error) throw error
        return { success: true, count: count || 0 }
    } catch (error: any) {
        console.error('[getUnreadAlertsCount] Error:', error)
        return { success: false, count: 0 }
    }
}

export async function getAlerts() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Unauthorized' }

        const { data, error } = await supabase
            .from('alerts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) throw error
        return { success: true, alerts: data }
    } catch (error: any) {
        console.error('[getAlerts] Error:', error)
        return { success: false, error: error.message }
    }
}

export async function markAlertRead(alertId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Unauthorized' }

        const { error } = await supabase
            .from('alerts')
            .update({ is_read: true })
            .eq('id', alertId)
            .eq('user_id', user.id)

        if (error) throw error
        revalidatePath('/dashboard', 'layout')
        revalidatePath('/alerts')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function markAllAlertsRead() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Unauthorized' }

        const { error } = await supabase
            .from('alerts')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false)

        if (error) throw error
        revalidatePath('/dashboard', 'layout')
        revalidatePath('/alerts')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function clearReadAlerts() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { success: false, error: 'Unauthorized' }

        const { error } = await supabase
            .from('alerts')
            .delete()
            .eq('user_id', user.id)
            .eq('is_read', true)

        if (error) throw error
        revalidatePath('/alerts')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
