import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = {
    title: 'Dashboard — LeadRadar',
}

import { getAuthenticatedUser } from '@/lib/services/auth'

export default async function DashboardPage() {
    const supabase = await createClient()
    const user = await getAuthenticatedUser()

    if (!user) redirect('/login')

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    // Execute all queries in parallel to eliminate waterfalls
    const [
        { count: keywordsCount },
        { count: communitiesCount },
        { count: newLeadsCount },
        { count: savedLeadsCount },
        { data: leads }
    ] = await Promise.all([
        supabase.from('tracked_keywords').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_active', true),
        supabase.from('user_monitored_communities').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', startOfToday.toISOString()),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'saved'),
        supabase.from('leads').select('*, communities(name), sources(name)').eq('user_id', user.id).neq('status', 'dismissed').order('created_at', { ascending: false }).limit(10)
    ])

    return (
        <DashboardClient
            leads={leads || []}
            totalKeywords={keywordsCount || 0}
            totalCommunities={communitiesCount || 0}
            newLeadsCount={newLeadsCount || 0}
            savedLeadsCount={savedLeadsCount || 0}
        />
    )
}
