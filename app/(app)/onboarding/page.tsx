import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BusinessTypeStep } from '@/components/onboarding/BusinessTypeStep'
import { Radar } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Getting started — LeadRadar',
}

export default async function OnboardingPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // If already onboarded, skip to dashboard
    const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()

    if (profile?.onboarding_completed) {
        redirect('/dashboard')
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/40 px-4 py-16">
            <article className="w-full max-w-xl">
                {/* Brand */}
                <header className="flex flex-col items-center text-center mb-10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 shadow-md shadow-indigo-200">
                            <Radar className="w-5 h-5 text-white" aria-hidden="true" />
                        </div>
                        <span className="text-lg font-bold text-foreground tracking-tight">LeadRadar</span>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 mb-6" aria-label="Onboarding step 1 of 3">
                        <div className="w-8 h-1.5 rounded-full bg-indigo-600" aria-hidden="true" />
                        <div className="w-8 h-1.5 rounded-full bg-muted" aria-hidden="true" />
                        <div className="w-8 h-1.5 rounded-full bg-muted" aria-hidden="true" />
                    </div>

                    <h1 className="text-2xl font-bold text-foreground">
                        What type of business do you run?
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm max-w-sm">
                        We&apos;ll personalise your keyword recommendations and communities to match your business.
                    </p>
                </header>

                {/* Card */}
                <section
                    className="bg-card rounded-2xl border border-border p-8 shadow-sm"
                    aria-label="Business type selection"
                >
                    <BusinessTypeStep />
                </section>

                <footer className="text-center mt-6 text-xs text-muted-foreground">
                    Step 1 of 3 — You can always change this in Settings.
                </footer>
            </article>
        </main>
    )
}
