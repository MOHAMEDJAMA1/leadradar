'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getAuthenticatedUser } from '@/lib/services/auth'

export type LeadStatus = 'new' | 'viewed' | 'saved' | 'contacted' | 'dismissed'

export async function updateLeadStatus(leadId: string, newStatus: LeadStatus) {
    try {
        const supabase = await createClient()
        const user = await getAuthenticatedUser()

        if (!user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', leadId)
            .eq('user_id', user.id)

        if (error) {
            console.error('[updateLeadStatus] Error:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/dashboard')
        revalidatePath('/leads')
        return { success: true }
    } catch (error: any) {
        console.error('[updateLeadStatus] Unexpected error:', error)
        return { success: false, error: error.message || 'Server Error' }
    }
}

export async function getLeads(
    filters?: { status?: string; keyword?: string; community?: string; confidence?: string },
    sort?: 'newest' | 'highest_intent'
) {
    try {
        const supabase = await createClient()
        const user = await getAuthenticatedUser()

        if (!user) throw new Error('Unauthorized')

        let query = supabase
            .from('leads')
            .select('*, communities(name), sources(name)')
            .eq('user_id', user.id)

        if (filters?.status) {
            query = query.eq('status', filters.status)
        } else {
            // Default: don't show dismissed stuff unless specifically requested
            query = query.neq('status', 'dismissed')
        }

        if (filters?.keyword) query = query.eq('matched_keyword', filters.keyword)
        if (filters?.community) query = query.eq('community_id', filters.community)
        if (filters?.confidence) query = query.eq('lead_confidence', filters.confidence)

        if (sort === 'highest_intent') {
            query = query.order('intent_score_numeric', { ascending: false, nullsFirst: false })
            query = query.order('detected_at', { ascending: false, nullsFirst: false })
            query = query.order('created_at', { ascending: false })
        } else {
            // default 'newest'
            query = query.order('detected_at', { ascending: false, nullsFirst: false })
            query = query.order('created_at', { ascending: false })
        }

        // Limit to 100 for now to avoid huge queries
        query = query.limit(100)

        const { data, error } = await query
        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        console.error('[getLeads] Error Details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        })
        return { success: false, error: error.message || 'Database query failed' }
    }
}

