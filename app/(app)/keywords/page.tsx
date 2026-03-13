import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getKeywords } from '@/app/actions/keywords'
import { KeywordsClient } from '@/components/keywords/KeywordsClient'

export const metadata: Metadata = {
    title: 'Keywords — LeadRadar',
}

export default async function KeywordsPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const keywords = await getKeywords()

    return <KeywordsClient initialKeywords={keywords} />
}
