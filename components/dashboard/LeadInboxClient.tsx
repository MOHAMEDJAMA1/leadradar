'use client'

import { LeadListClient } from '@/components/dashboard/LeadListClient'
import type { DBLead } from '@/types/leads'
import { useRouter } from 'next/navigation'
import { Flame, Inbox, Bookmark, MessageSquare, Trash2, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

interface LeadInboxClientProps {
    leads: DBLead[]
    currentTab: string
    currentSort: string
}

const TABS = [
    { id: 'all', label: 'All Leads', icon: Inbox },
    { id: 'hot', label: 'Hot Leads', icon: Flame, color: 'text-amber-400' },
    { id: 'saved', label: 'Saved', icon: Bookmark, color: 'text-blue-400' },
    { id: 'contacted', label: 'Contacted', icon: MessageSquare, color: 'text-emerald-400' },
    { id: 'dismissed', label: 'Dismissed', icon: Trash2, color: 'text-slate-500' },
]

export function LeadInboxClient({ leads, currentTab, currentSort }: LeadInboxClientProps) {
    const router = useRouter()

    const handleTabChange = (tabId: string) => {
        const url = new URL(window.location.href)
        url.searchParams.set('tab', tabId)
        router.push(url.pathname + url.search)
    }

    const handleSortChange = () => {
        const nextSort = currentSort === 'highest_intent' ? 'newest' : 'highest_intent'
        const url = new URL(window.location.href)
        url.searchParams.set('sort', nextSort)
        router.push(url.pathname + url.search)
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Lead Inbox</h1>
                    <p className="text-slate-400 mt-1">Review, qualify, and manage your generated leads.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSortChange}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/8 transition-colors"
                    >
                        <ArrowUpDown className="w-4 h-4" />
                        Sort: {currentSort === 'highest_intent' ? 'Highest Intent' : 'Newest First'}
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/8 transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
                {TABS.map((tab) => {
                    const isActive = currentTab === tab.id
                    const Icon = tab.icon
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-b-2 text-sm font-bold transition-all whitespace-nowrap ${isActive
                                    ? 'border-blue-500 text-white bg-white/5'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive && tab.color ? tab.color : ''}`} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* List */}
            <LeadListClient initialLeads={leads} hideHeader={true} />
        </div>
    )
}
