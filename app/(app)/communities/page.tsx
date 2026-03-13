import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CommunitiesClient } from '@/components/communities/CommunitiesClient'
import type { CommunityState } from '@/app/actions/communities'

export const metadata: Metadata = { title: 'Communities — LeadRadar' }

export default async function CommunitiesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 1. Get all available communities from DB
    const { data: allCommunities } = await supabase
        .from('communities')
        .select('id, name, sources(name)')
        .order('name')

    // 2. Get user's currently monitored communities
    const { data: monitored } = await supabase
        .from('user_monitored_communities')
        .select('community_id')
        .eq('user_id', user.id)

    const monitoredIds = new Set(monitored?.map(m => m.community_id) ?? [])

    // 3. Map to state objects
    const state: CommunityState[] = (allCommunities ?? []).map(c => ({
        id: c.id,
        name: c.name,
        // @ts-ignore — sources is joined as an object
        source_name: c.sources?.name ?? 'Unknown',
        isMonitored: monitoredIds.has(c.id)
    }))

    return (
        <div className="max-w-6xl mx-auto">
            <CommunitiesClient communities={state} />
        </div>
    )
}
