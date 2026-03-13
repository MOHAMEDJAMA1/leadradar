import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = {
    title: 'Dashboard — LeadRadar',
}

export default async function DashboardPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch total tracked keywords
    const { count: keywordsCount } = await supabase
        .from('tracked_keywords')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_active', true)

    // Fetch total monitored communities
    const { count: communitiesCount } = await supabase
        .from('user_monitored_communities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // Calculate start of today for New Leads count
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    // Fetch New Leads Today
    const { count: newLeadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfToday.toISOString())

    // Fetch Saved Leads
    const { count: savedLeadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'saved')

    // Fetch leads for the recent table
    const { data: leads } = await supabase
        .from('leads')
        .select(`
            *,
            communities(name),
            sources(name)
        `)
        .eq('user_id', user.id)
        .neq('status', 'dismissed')
        .order('created_at', { ascending: false })
        .limit(10)

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
