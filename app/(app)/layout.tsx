import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { getUserSettings } from '@/app/actions/settings'

import { Suspense } from 'react'
import { LoadingBar } from '@/components/layout/LoadingBar'

import { getAuthenticatedUser } from '@/lib/services/auth'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Parallelize authentication and settings fetch
    const [
        user,
        { settings, success }
    ] = await Promise.all([
        getAuthenticatedUser(),
        getUserSettings()
    ])

    if (!user) {
        redirect('/login')
    }

    // Derive display name from email
    const userName = user.user_metadata?.full_name
        ?? user.email?.split('@')[0]
        ?? 'User'

    // Intercept incomplete onboarding
    if (!success || !settings || !settings.onboarding_completed) {
        redirect('/onboarding')
    }

    return (
        <div className="min-h-screen bg-[#0d1117]">
            <Suspense fallback={null}>
                <LoadingBar />
            </Suspense>
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
