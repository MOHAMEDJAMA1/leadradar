'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Community {
    id: string
    name: string
    source_name: string
}

export interface CommunityState extends Community {
    isMonitored: boolean
}

export async function updateMonitoredCommunities(communityIds: string[]): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'Unauthorized' }

        // 1. Delete all current monitored communities for user
        const { error: deleteErr } = await supabase
            .from('user_monitored_communities')
            .delete()
            .eq('user_id', user.id)

        if (deleteErr) throw deleteErr

        // 2. Insert new ones
        if (communityIds.length > 0) {
            const inserts = communityIds.map(community_id => ({
                user_id: user.id,
                community_id
            }))

            const { error: insertErr } = await supabase
                .from('user_monitored_communities')
                .insert(inserts)

            if (insertErr) throw insertErr
        }

        revalidatePath('/communities')
        return { success: true }
    } catch (error) {
        console.error('[Action] updateMonitoredCommunities error:', error)
        return { success: false, error: 'Failed to save communities' }
    }
}
