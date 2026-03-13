import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserSettings } from '@/app/actions/settings'
import { SettingsClient } from '@/components/dashboard/SettingsClient'

export const metadata: Metadata = {
    title: 'Settings — LeadRadar',
}

export default async function SettingsPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { settings } = await getUserSettings()

    return (
        <SettingsClient initialSettings={settings || { scan_frequency: '1h', email_alerts_enabled: true }} />
    )
}
