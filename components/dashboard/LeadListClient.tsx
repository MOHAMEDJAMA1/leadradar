'use client'

import { useState, useEffect } from 'react'
import { SlidersHorizontal, Download, Sparkles } from 'lucide-react'
import { LeadRow } from '@/components/dashboard/LeadRow'
import { LeadDetailPanel } from '@/components/dashboard/LeadDetailPanel'
import type { DBLead } from '@/types/leads'

interface LeadListClientProps {
    initialLeads: DBLead[]
    hideHeader?: boolean
}

const DEMO_LEAD: DBLead = {
    id: 'demo-lead-1',
    user_id: 'demo',
    keyword_id: 'demo',
    community_id: 'demo',
    title: 'Looking for a skilled web developer for a new SaaS project',
    full_content: 'We are a startup looking for a web developer to help us build out our MVP. Need someone with React and Next.js experience.',
    content_snippet: 'looking for a web developer to help us build out our MVP',
    source_url: '#',
    author: 'startup_founder_99',
    intent_score_numeric: 95,
    intent_level: 'high',
    lead_confidence: 'Hot',
    match_reasons_json: ['Hiring signal detected', 'Proximity: Keyword near intent phrase'],
    status: 'new',
    detected_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    matched_keyword: 'web developer',
    lead_type: 'post',
    platform: 'reddit',
    communities: { name: 'startups' },
} as unknown as DBLead

export function LeadListClient({ initialLeads, hideHeader = false }: LeadListClientProps) {
    const [leads, setLeads] = useState<DBLead[]>(initialLeads)
    const [selectedLead, setSelectedLead] = useState<DBLead | null>(null)

    // Sync newly fetched leads if the page revalidates after a scan
    useEffect(() => {
        setLeads(initialLeads)
    }, [initialLeads])

    // Handle optimistic UI updates when status changes
    const handleStatusUpdate = (leadId: string, newStatus: DBLead['status']) => {
        setLeads((prev) =>
            prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        )
        if (selectedLead?.id === leadId) {
            setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null))
        }
    }

    return (
        <div className={`transition-all duration-300 ${selectedLead ? 'lg:mr-[400px]' : ''}`}>
            <section className="rounded-2xl border border-white/8 bg-[#111827] overflow-hidden" aria-labelledby="lead-inbox-heading">
                {/* Section header */}
                {!hideHeader && (
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <div>
                            <h2 id="lead-inbox-heading" className="text-base font-bold text-white">Lead Inbox</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Real-time intent-based signals from 12 monitored platforms</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-white/5 hover:bg-white/10 border border-white/8 transition-colors">
                                <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                                Filter
                            </button>
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-white/5 hover:bg-white/10 border border-white/8 transition-colors">
                                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                                Export
                            </button>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" role="table" aria-label="Lead inbox">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th scope="col" className="text-left py-3 px-5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Lead Title &amp; Intent</th>
                                <th scope="col" className="text-left py-3 px-5 text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden md:table-cell">Community</th>
                                <th scope="col" className="text-left py-3 px-5 text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden lg:table-cell">Matched Keyword</th>
                                <th scope="col" className="text-left py-3 px-5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Confidence</th>
                                <th scope="col" className="text-left py-3 px-5 text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden sm:table-cell">Timestamp</th>
                                <th scope="col" className="text-left py-3 px-5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 px-5">
                                        <div className="flex flex-col items-center justify-center gap-6 text-center">
                                            {/* Status Card */}
                                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-8 shadow-inner shadow-blue-500/10 max-w-md w-full">
                                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-500/5">
                                                    <Sparkles className="w-6 h-6 text-blue-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white tracking-tight">Your radar is active</h3>
                                                <p className="text-sm text-slate-400 mt-2">
                                                    When someone posts a high-intent request matching your keywords, it will appear here.
                                                </p>
                                            </div>

                                            {/* Example Preview Label */}
                                            <div className="flex items-center gap-3 w-full max-w-xl">
                                                <div className="h-px flex-1 bg-white/5" />
                                                <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">Example High-Confidence Lead</span>
                                                <div className="h-px flex-1 bg-white/5" />
                                            </div>

                                            {/* Minimal Row Preview */}
                                            <div className="w-full max-w-4xl opacity-50 pointer-events-none select-none border border-white/5 rounded-xl overflow-hidden bg-white/[0.02]">
                                                <table className="w-full border-collapse">
                                                    <tbody>
                                                        <LeadRow lead={DEMO_LEAD} onClick={() => { }} />
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <LeadRow
                                        key={lead.id}
                                        lead={lead}
                                        onClick={setSelectedLead}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {leads.length > 0 && (
                    <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/5">
                        <p className="text-xs text-slate-500">Showing 1-{Math.min(100, leads.length)} of {leads.length} leads</p>
                    </div>
                )}
            </section>

            {/* Detail Panel */}
            <LeadDetailPanel
                lead={selectedLead}
                onClose={() => setSelectedLead(null)}
                onStatusUpdate={handleStatusUpdate as any}
            />
        </div>
    )
}
