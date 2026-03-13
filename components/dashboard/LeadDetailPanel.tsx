'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Bookmark, MessageSquare, Trash2, Zap, Sparkles, Copy, Check, RefreshCcw, Twitter, Globe2 } from 'lucide-react'
import type { DBLead } from '@/types/leads'
import { updateLeadStatus } from '@/app/actions/leads'
import { generateAiReply } from '@/app/actions/ai-reply'

interface LeadDetailPanelProps {
    lead: DBLead | null
    onClose: () => void
    onStatusUpdate?: (leadId: string, newStatus: string) => void
}

function BarChart({ score }: { score: number }) {
    // Simple bar chart visualization
    const bars = Array.from({ length: 20 }, (_, i) => {
        const height = 20 + Math.sin(i * 0.8 + score * 0.05) * 15 + (i / 20) * 30
        return Math.max(8, Math.min(height, 55))
    })
    return (
        <div className="flex items-end gap-0.5 h-16 w-full" aria-hidden="true">
            {bars.map((h, i) => (
                <div
                    key={i}
                    className="flex-1 rounded-sm opacity-70"
                    style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, #06b6d4, #6366f1)`,
                        opacity: 0.4 + (i / bars.length) * 0.6,
                    }}
                />
            ))}
        </div>
    )
}

function classifyOpportunity(score: number): { name: string; range: string } {
    if (score >= 80) return { name: 'High-Value Prospect', range: '$5k - $15k' }
    if (score >= 50) return { name: 'Qualified Lead', range: '$2k - $5k' }
    return { name: 'Early Research', range: 'Unknown' }
}

function formatReason(reason: string) {
    if (!reason) return ''
    // Convert snake_case or specific technical labels to pretty titles
    return reason
        .split('_')
        .map(word => {
            if (word === 'signal' || word === 'detected') return ''
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .filter(Boolean)
        .join(' ')
}

export function LeadDetailPanel({ lead, onClose, onStatusUpdate }: LeadDetailPanelProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [localAiReply, setLocalAiReply] = useState<string | null>(null)
    const [isCopied, setIsCopied] = useState(false)
    const [aiError, setAiError] = useState<string | null>(null)

    // Reset local state when the selected lead changes
    useEffect(() => {
        if (lead) {
            setLocalAiReply(lead.ai_reply_text || null)
            setAiError(null)
            setIsCopied(false)
        }
    }, [lead?.id]) // only run when the lead ID changes

    if (!lead) return null

    const confidence = lead.lead_confidence || 'Low'
    const isHot = confidence === 'Hot'
    const isHigh = confidence === 'High'
    const isMedium = confidence === 'Medium'
    const score = lead.intent_score_numeric || 20

    const confidenceColor = isHot
        ? 'text-red-400'
        : isHigh
            ? 'text-emerald-400'
            : isMedium
                ? 'text-blue-400'
                : 'text-slate-400'

    const confidenceLabel = isHot
        ? 'HOT LEAD DETECTED'
        : isHigh
            ? 'HIGH CONFIDENCE DETECTED'
            : isMedium
                ? 'MEDIUM CONFIDENCE DETECTED'
                : 'LOW CONFIDENCE DETECTED'

    const barColor = isHot
        ? 'from-red-600 to-orange-500'
        : isHigh
            ? 'from-emerald-500 to-cyan-400'
            : isMedium
                ? 'from-blue-500 to-indigo-400'
                : 'from-slate-500 to-slate-400'

    const oppValue = classifyOpportunity(score)

    return (
        <>
            {/* Backdrop (mobile) */}
            <div
                className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <aside
                className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#0d1117] border-l border-white/8 z-50 flex flex-col overflow-y-auto shadow-2xl"
                role="complementary"
                aria-label="Lead Intelligence panel"
            >
                {/* Header */}
                <header className="flex items-start justify-between p-5 border-b border-white/5 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-white">Lead Intelligence</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Analysis for{' '}
                            <span className="text-blue-400 font-medium">{oppValue.name}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors"
                        aria-label="Close lead detail"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </header>

                <div className="flex-1 p-5 space-y-5 overflow-y-auto">
                    {/* Intent Score */}
                    <section aria-labelledby="intent-score-label">
                        <div className="flex items-center justify-between mb-2">
                            <p id="intent-score-label" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Intent Score
                            </p>
                            <span className="text-3xl font-black text-white">{score}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/8 overflow-hidden mb-2" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                                style={{ width: `${score}%` }}
                            />
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${confidenceColor}`}>
                            <Zap className="w-3 h-3" aria-hidden="true" />
                            {confidenceLabel}
                        </div>
                    </section>

                    {/* Original Content Snippet */}
                    <section className="flex flex-col gap-2 p-3.5 rounded-xl border border-white/8 bg-white/3" aria-label="Original Content">
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                                {lead.lead_type === 'comment' ? 'Reddit Comment Match' : lead.platform === 'twitter' ? 'Twitter Post Match' : 'Reddit Post Match'}
                            </p>
                            {lead.platform === 'twitter' ? (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20">
                                    <Twitter className="w-3 h-3" />
                                    X (TWITTER)
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                    <Globe2 className="w-3 h-3" />
                                    REDDIT
                                </div>
                            )}
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1.5">Source Thread:</span>
                            <span className="text-xs font-semibold text-slate-200">"{lead.parent_post_title || 'Direct Post'}"</span>
                        </div>
                        <p className="text-sm font-medium text-slate-300 italic border-l-2 border-blue-500/30 pl-3">
                            "{lead.content_snippet}"
                        </p>
                    </section>

                    {/* AI Assistant */}
                    <section aria-labelledby="ai-assistant-label" className="flex flex-col gap-3">
                        <p id="ai-assistant-label" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            AI Assistant
                        </p>

                        {localAiReply ? (
                            <div className="flex flex-col gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 overflow-hidden">
                                <div className="p-4">
                                    <p className="text-xs font-semibold text-blue-400 mb-2">AI Suggested Reply</p>
                                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {localAiReply}
                                    </p>
                                </div>
                                <div className="flex items-center gap-px border-t border-blue-500/10 bg-black/20">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(localAiReply)
                                            setIsCopied(true)
                                            setTimeout(() => setIsCopied(false), 2000)
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        {isCopied ? 'Copied' : 'Copy Reply'}
                                    </button>
                                    <div className="w-px h-6 bg-blue-500/10" />
                                    <button
                                        onClick={async () => {
                                            setIsGenerating(true)
                                            setAiError(null)
                                            const result = await generateAiReply(lead.id)
                                            if (result.success && result.replyText) setLocalAiReply(result.replyText)
                                            else setAiError(result.error || 'Failed to generate')
                                            setIsGenerating(false)
                                        }}
                                        disabled={isGenerating}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                                        Regenerate
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={async () => {
                                        setIsGenerating(true)
                                        setAiError(null)
                                        const result = await generateAiReply(lead.id)
                                        if (result.success && result.replyText) setLocalAiReply(result.replyText)
                                        else setAiError(result.error || 'Failed to generate')
                                        setIsGenerating(false)
                                    }}
                                    disabled={isGenerating}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold text-white transition-colors disabled:opacity-50 shadow-sm"
                                >
                                    <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-pulse text-blue-400' : 'text-slate-400'}`} />
                                    {isGenerating ? 'Writing Reply...' : 'Generate AI Reply'}
                                </button>
                                {aiError && <p className="text-xs text-red-400 text-center px-2">{aiError}</p>}
                            </div>
                        )}
                    </section>

                    {/* Opportunity Value */}
                    <section aria-labelledby="opp-value-label">
                        <p id="opp-value-label" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                            Opportunity Value
                        </p>
                        <div className="rounded-xl border border-white/8 overflow-hidden">
                            <div className="p-3 bg-gradient-to-b from-white/3 to-transparent">
                                <BarChart score={score} />
                            </div>
                            <div className="px-3 py-2.5 flex items-center justify-between border-t border-white/5">
                                <div>
                                    <p className="text-sm font-semibold text-white">{oppValue.name}</p>
                                    <p className="text-xs text-slate-500">Potential Value: {oppValue.range}</p>
                                </div>
                                <button className="text-slate-600 hover:text-slate-400 transition-colors" aria-label="More info">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Why This Matched */}
                    {lead.match_reasons_json && lead.match_reasons_json.length > 0 && (
                        <section aria-labelledby="why-matched-label">
                            <p id="why-matched-label" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                                Why This Matched
                            </p>
                            <ul className="space-y-2">
                                {lead.match_reasons_json.map((reason, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <div className="shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/30 mt-0.5">
                                            <svg className="w-2.5 h-2.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <span
                                            className="text-sm text-slate-300"
                                            dangerouslySetInnerHTML={{
                                                __html: formatReason(reason).replace(/"([^"]+)"/g, '<em class="text-white not-italic font-medium">"$1"</em>')
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Matched Keywords */}
                    {lead.matched_keyword && (
                        <section aria-labelledby="matched-kw-label">
                            <p id="matched-kw-label" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                                Matched Keyword
                            </p>
                            <div className="flex flex-wrap gap-2" role="list">
                                <span role="listitem" className="px-2.5 py-1 rounded-full text-xs font-medium border border-white/10 text-slate-300 bg-white/4">
                                    {lead.matched_keyword}
                                </span>
                            </div>
                        </section>
                    )}
                </div>

                {/* Actions */}
                <footer className="p-5 border-t border-white/5 space-y-2 shrink-0">
                    <a
                        href={(lead.lead_type === 'comment' ? lead.comment_url : lead.source_url) || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 shadow-lg shadow-blue-500/20 transition-all duration-150"
                    >
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        {lead.lead_type === 'comment' ? 'View Comment' : 'View Original Post'}
                    </a>
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                await updateLeadStatus(lead.id, lead.status === 'saved' ? 'new' : 'saved')
                                if (onStatusUpdate) onStatusUpdate(lead.id, lead.status === 'saved' ? 'new' : 'saved')
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/8 transition-colors"
                        >
                            <Bookmark className={`w-3.5 h-3.5 ${lead.status === 'saved' ? 'fill-current text-blue-400' : ''}`} aria-hidden="true" />
                            {lead.status === 'saved' ? 'Saved' : 'Save Lead'}
                        </button>
                        <button
                            onClick={async () => {
                                await updateLeadStatus(lead.id, lead.status === 'contacted' ? 'new' : 'contacted')
                                if (onStatusUpdate) onStatusUpdate(lead.id, lead.status === 'contacted' ? 'new' : 'contacted')
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/8 transition-colors"
                        >
                            <MessageSquare className={`w-3.5 h-3.5 ${lead.status === 'contacted' ? 'text-emerald-400' : ''}`} aria-hidden="true" />
                            {lead.status === 'contacted' ? 'Contacted' : 'Mark Contacted'}
                        </button>
                    </div>
                    <button
                        onClick={async () => {
                            await updateLeadStatus(lead.id, 'dismissed')
                            if (onStatusUpdate) onStatusUpdate(lead.id, 'dismissed')
                            onClose()
                        }}
                        className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-slate-600 hover:text-slate-400 transition-colors"
                    >
                        <Trash2 className="w-3 h-3" aria-hidden="true" />
                        Dismiss Recommendation
                    </button>
                </footer>
            </aside>
        </>
    )
}

