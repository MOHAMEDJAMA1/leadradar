import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { getUserSettings } from '@/app/actions/settings'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Derive display name from email
    const userName = user.user_metadata?.full_name
        ?? user.email?.split('@')[0]
        ?? 'User'

    // Intercept incomplete onboarding
    const { settings, success } = await getUserSettings()
    
    // If settings missing OR onboarding not marked complete, push to onboarding
    if (!success || !settings || !settings.onboarding_completed) {
        redirect('/onboarding')
    }

    return (
        <div className="min-h-screen bg-[#0d1117]">
            <Sidebar />
            <div className="pl-[220px]">
                <TopNav userName={userName} userRole="ADMIN" lastScanAt={settings?.last_scan_at} />
                <main className="pt-14 p-6 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    )
}
