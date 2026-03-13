import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAlerts } from '@/app/actions/alerts'
import { AlertsClient } from '@/components/dashboard/AlertsClient'

export const metadata: Metadata = {
    title: 'Alerts — LeadRadar',
}

export default async function AlertsPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { alerts } = await getAlerts()

    return (
        <AlertsClient initialAlerts={alerts || []} />
    )
}
