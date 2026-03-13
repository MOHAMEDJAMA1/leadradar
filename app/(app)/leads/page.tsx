import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLeads } from '@/app/actions/leads'
import { LeadInboxClient } from '@/components/dashboard/LeadInboxClient'
import { isHotLead } from '@/types/leads'

export const metadata: Metadata = {
    title: 'Lead Inbox — LeadRadar',
}

import { getAuthenticatedUser } from '@/lib/services/auth'

export default async function LeadsPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; sort?: string; page?: string }>
}) {
    const supabase = await createClient()
    const params = await searchParams
    const tab = params.tab || 'all'
    const sort = params.sort === 'highest_intent' ? 'highest_intent' : 'newest'

    // Define standard filters based on tab
    let filters: { status?: string; confidence?: string } = {}
    if (tab === 'saved') filters.status = 'saved'
    if (tab === 'contacted') filters.status = 'contacted'
    if (tab === 'dismissed') filters.status = 'dismissed'
    if (tab === 'hot') filters.confidence = 'Hot'

    // Fetch user and leads in parallel
    const [
        user,
        { data: leads, error: leadsError }
    ] = await Promise.all([
        getAuthenticatedUser(),
        getLeads(filters, sort as 'highest_intent' | 'newest')
    ])

    if (!user) redirect('/login')

    if (leadsError) {
        console.error('[LeadsPage] Fetch Error:', leadsError)
    }

    const displayedLeads = leads || []

    return (
        <LeadInboxClient
            leads={displayedLeads}
            currentTab={tab}
            currentSort={sort}
        />
    )
}
