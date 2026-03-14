'use client'

import { TrendingUp, Key, Globe2, Bookmark, Twitter } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { LeadListClient } from '@/components/dashboard/LeadListClient'
import type { DBLead } from '@/types/leads'

interface DashboardClientProps {
    leads: DBLead[]
    totalKeywords: number
    totalCommunities: number
    newLeadsCount: number
    savedLeadsCount: number
}

export default function DashboardClient({ leads, totalKeywords, totalCommunities, newLeadsCount, savedLeadsCount }: DashboardClientProps) {

    const STAT_CARDS = [
        {
            icon: <TrendingUp className="w-4 h-4 text-blue-400" aria-hidden="true" />,
            iconBg: 'bg-blue-500/15',
            label: 'New Leads (24h)',
            value: newLeadsCount.toString(),
            delta: '+12.5%',
            deltaType: 'up' as const,
        },
        {
            icon: <Key className="w-4 h-4 text-violet-400" aria-hidden="true" />,
            iconBg: 'bg-violet-500/15',
            label: 'Tracked Keywords',
            value: totalKeywords.toString(),
            delta: '+4.2%',
            deltaType: 'up' as const,
        },
        {
            icon: <Globe2 className="w-4 h-4 text-cyan-400" aria-hidden="true" />,
            iconBg: 'bg-cyan-500/15',
            label: 'Communities Monitored',
            value: totalCommunities.toString(),
            delta: 'Steady',
            deltaType: 'neutral' as const,
        },
        {
            icon: <Bookmark className="w-4 h-4 text-emerald-400" aria-hidden="true" />,
            iconBg: 'bg-emerald-500/15',
            label: 'Saved Leads',
            value: savedLeadsCount.toString(),
            delta: '+18.1%',
            deltaType: 'up' as const,
        },
    ]

    return (
        <>
            <div className="space-y-6">
                {/* Stat cards */}
                <section className="grid grid-cols-2 xl:grid-cols-4 gap-4" aria-label="Key metrics">
                    {STAT_CARDS.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </section>

                {/* Active Sources Indicator (Phase 8) */}
                <section className="bg-white/4 border border-white/8 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Signal Sources Active</h3>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 shadow-sm">
                            <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <Globe2 className="w-4 h-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white leading-none">Reddit Communities</p>
                                <p className="text-[10px] text-slate-500 font-medium mt-1">Real-time discussion scanner</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8 shadow-sm">
                            <div className="p-1.5 rounded-lg bg-[#1DA1F2]/10 border border-[#1DA1F2]/20">
                                <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white leading-none">Twitter / X</p>
                                <p className="text-[10px] text-slate-500 font-medium mt-1">Direct intent scraping</p>
                            </div>
                        </div>
                    </div>
                </section>

                <LeadListClient initialLeads={leads} />
            </div>
        </>
    )
}
