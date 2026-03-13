'use client'

import { useState, useEffect } from 'react'
import type { DBLead } from '@/types/leads'
import { isHotLead } from '@/types/leads'
import { Flame, Twitter, Globe2 } from 'lucide-react'

const CONFIDENCE_STYLES: Record<string, string> = {
    Hot: 'bg-red-500/15 text-red-400 border-red-500/20',
    High: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    Low: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
}

interface LeadRowProps {
    lead: DBLead
    onClick: (lead: DBLead) => void
}

function timeAgo(dateString: string) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const daysDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / 86400000)
    if (daysDifference === 0) {
        const hours = Math.round((new Date(dateString).getTime() - new Date().getTime()) / 3600000)
        if (hours === 0) {
            const mins = Math.round((new Date(dateString).getTime() - new Date().getTime()) / 60000)
            return rtf.format(mins, 'minute')
        }
        return rtf.format(hours, 'hour')
    }
    return rtf.format(daysDifference, 'day')
}

function formatReason(reason: string) {
    if (!reason) return ''
    // Convert snake_case or technical labels to pretty titles
    return reason
        .split(/[ _]/) // Split by space or underscore
        .map(word => {
            const w = word.toLowerCase()
            if (w === 'signal' || w === 'detected') return ''
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .filter(Boolean)
        .join(' ')
}

export function LeadRow({ lead, onClick }: LeadRowProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const confidence = lead.lead_confidence || 'Low'
    const confidenceStyle = CONFIDENCE_STYLES[confidence] ?? CONFIDENCE_STYLES['Low']
    const isNew = lead.status === 'new'
    const hot = confidence === 'Hot'
    const opacityClass = lead.status === 'dismissed' ? 'opacity-40 hover:opacity-100' : ''

    return (
        <tr
            onClick={() => onClick(lead)}
            className={`border-b border-white/5 cursor-pointer transition-colors group ${isNew ? 'bg-blue-500-[0.02] hover:bg-white/5' : 'hover:bg-white/2'} ${opacityClass}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick(lead)}
            aria-label={`View lead: ${lead.title}`}
        >
            {/* Title & intent */}
            <td className="py-4 px-5">
                <div className="flex items-start gap-3">
                    {isNew && !hot && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.6)]" aria-label="New unread lead" />
                    )}
                    {hot && (
                        <Flame className="shrink-0 w-4 h-4 text-red-500 mt-0.5" aria-hidden="true" />
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <p className={`text-sm group-hover:text-blue-300 transition-colors leading-snug max-w-xs flex items-center flex-wrap gap-1.5 ${isNew ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                                {lead.lead_type === 'comment' ? (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                                        Comment Match
                                    </span>
                                ) : lead.platform === 'twitter' ? (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1DA1F2] bg-[#1DA1F2]/10 px-1.5 py-0.5 rounded border border-[#1DA1F2]/20">
                                        Twitter Lead
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                                        Reddit Lead
                                    </span>
                                )}
                                <span>&ldquo;{lead.title || 'Untitled Post'}&rdquo;</span>
                            </p>
                            {hot && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                                    Hot Lead
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {lead.match_reasons_json && lead.match_reasons_json.slice(0, 2).map((reason: string) => (
                                <span key={reason} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/8 text-slate-400">
                                    {formatReason(reason)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </td>

            {/* Community/Platform */}
            <td className="py-4 px-5 hidden md:table-cell">
                <div className="flex items-center gap-2">
                    {lead.platform === 'twitter' ? (
                        <>
                            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                            <span className="text-sm text-slate-300 font-medium">X (Twitter)</span>
                        </>
                    ) : (
                        <>
                            <Globe2 className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-slate-300">r/{lead.communities?.name || 'Unknown'}</span>
                        </>
                    )}
                </div>
            </td>

            {/* Matched keyword */}
            <td className="py-4 px-5 hidden lg:table-cell">
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium border border-white/10 text-slate-300 bg-white/4">
                    {lead.matched_keyword || 'Phrase Match'}
                </span>
            </td>

            {/* Confidence */}
            <td className="py-4 px-5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${confidenceStyle}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                    {confidence}
                </span>
            </td>

            {/* Time */}
            <td className="py-4 px-5 hidden sm:table-cell">
                <span className="text-xs text-slate-500">
                    {mounted ? timeAgo(lead.created_at) : '...'}
                </span>
            </td>

            {/* Actions */}
            <td className="py-4 px-5">
                <button
                    onClick={(e) => { e.stopPropagation(); onClick(lead) }}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                    View →
                </button>
            </td>
        </tr>
    )
}

