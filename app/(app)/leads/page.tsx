import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLeads } from '@/app/actions/leads'
import { LeadInboxClient } from '@/components/dashboard/LeadInboxClient'
import { isHotLead } from '@/types/leads'

export const metadata: Metadata = {
    title: 'Lead Inbox — LeadRadar',
}

export default async function LeadsPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; sort?: string; page?: string }>
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const params = await searchParams
    const tab = params.tab || 'all' // all, hot, saved, contacted, dismissed
    const sort = params.sort === 'highest_intent' ? 'highest_intent' : 'newest'

    // Define standard filters based on tab
    let filters: { status?: string; confidence?: string } = {}
    if (tab === 'saved') filters.status = 'saved'
    if (tab === 'contacted') filters.status = 'contacted'
    if (tab === 'dismissed') filters.status = 'dismissed'
    
    // If "hot" we want all hot leads regardless of status (as long as not dismissed)
    // Deep Fix: Use native DB filter for Hot leads to ensure accuracy
    if (tab === 'hot') {
        filters.confidence = 'Hot'
    }

    const { data: leads, error: leadsError } = await getLeads(filters, sort as 'highest_intent' | 'newest')

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
