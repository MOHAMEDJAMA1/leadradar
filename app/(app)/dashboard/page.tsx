import { createClient } from '@/lib/supabase/server'
import {
    Target,
    TrendingUp,
    Globe,
    Tag,
    ArrowUpRight,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard',
}

const statCards = [
    {
        id: 'total-leads',
        label: 'Total Leads Found',
        value: '—',
        description: 'Set up keywords to start finding leads',
        icon: Target,
        iconColor: 'text-indigo-500',
        iconBg: 'bg-indigo-50',
    },
    {
        id: 'high-intent',
        label: 'High Intent Leads',
        value: '—',
        description: 'Posts with strong buying signals',
        icon: TrendingUp,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50',
    },
    {
        id: 'communities',
        label: 'Communities Monitored',
        value: '—',
        description: 'Subreddits being scanned',
        icon: Globe,
        iconColor: 'text-violet-500',
        iconBg: 'bg-violet-50',
    },
    {
        id: 'keywords',
        label: 'Keywords Tracked',
        value: '—',
        description: 'Active keyword patterns',
        icon: Tag,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-50',
    },
]

export default async function DashboardPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const firstName = user?.email?.split('@')[0] ?? 'there'

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Page header */}
            <header>
                <h2 className="text-2xl font-bold text-foreground">
                    Welcome back, {firstName} 👋
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                    Here&apos;s a summary of your lead activity.
                </p>
            </header>

            {/* Setup prompt banner */}
            <section
                className="flex items-start gap-4 p-5 rounded-xl bg-indigo-50 border border-indigo-100"
                aria-label="Setup guide"
            >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 shrink-0">
                    <ArrowUpRight className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-indigo-900 text-sm">
                        Complete your setup to start finding leads
                    </h3>
                    <p className="text-indigo-700/70 text-sm mt-0.5">
                        Add keywords and select communities to monitor. LeadRadar will surface relevant posts automatically.
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <a
                        href="/keywords"
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Add keywords
                    </a>
                </div>
            </section>

            {/* Stat cards */}
            <section aria-label="Activity statistics">
                <dl className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {statCards.map(({ id, label, value, description, icon: Icon, iconColor, iconBg }) => (
                        <div
                            key={id}
                            className="flex flex-col gap-4 p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBg} shrink-0`}>
                                <Icon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    {label}
                                </dt>
                                <dd className="text-3xl font-bold text-foreground mt-1.5">{value}</dd>
                                <p className="text-xs text-muted-foreground mt-1">{description}</p>
                            </div>
                        </div>
                    ))}
                </dl>
            </section>

            {/* Recent leads placeholder */}
            <section aria-label="Recent leads">
                <header className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-foreground">Recent Leads</h2>
                </header>
                <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-muted/30 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                        <Target className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No leads yet</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                        Once you set up keywords and communities, LeadRadar will display matched leads here.
                    </p>
                </div>
            </section>
        </div>
    )
}
