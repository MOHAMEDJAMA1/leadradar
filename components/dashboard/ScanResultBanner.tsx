'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import type { ScanSummary } from '@/lib/services/reddit/types'

interface ScanResultBannerProps {
    summary: ScanSummary | null
    error: string | null
    onDismiss: () => void
}

export function ScanResultBanner({ summary, error, onDismiss }: ScanResultBannerProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (summary || error) {
            setVisible(true)
            const timer = setTimeout(() => {
                setVisible(false)
                setTimeout(onDismiss, 300) // wait for exit animation
            }, 8000)
            return () => clearTimeout(timer)
        }
    }, [summary, error, onDismiss])

    if (!summary && !error) return null

    return (
        <div
            className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
                }`}
            role="alert"
        >
            <div className="flex items-start gap-3 p-4 pr-12 rounded-2xl shadow-2xl shadow-black/50 border backdrop-blur-md bg-[#111827]/90 text-sm max-w-lg min-w-[320px] relative">
                <button
                    onClick={() => {
                        setVisible(false)
                        setTimeout(onDismiss, 300)
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {error ? (
                    <>
                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                            <p className="font-bold text-white mb-0.5">Scan Failed</p>
                            <p className="text-slate-400">{error}</p>
                        </div>
                    </>
                ) : summary ? (
                    <>
                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="font-bold text-white mb-0.5">Scan Complete</p>
                            <p className="text-slate-400 leading-relaxed">
                                {summary.leadsCreated > 0 ? (
                                    <span>Detected <strong className="text-emerald-400 font-bold">{summary.leadsCreated} new leads</strong>.</span>
                                ) : (
                                    <span>No new leads found matching your keywords.</span>
                                )}
                            </p>

                            <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                                {summary.reddit && (
                                    <div className="flex items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
                                            <span className="text-slate-500 uppercase tracking-wider font-bold">Reddit</span>
                                        </div>
                                        <span className="text-slate-300">
                                            {summary.reddit.communitiesScanned} communities • {summary.reddit.postsChecked + (summary.reddit.commentsChecked || 0)} checked
                                        </span>
                                    </div>
                                )}
                                {summary.twitter && (
                                    <div className="flex items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                                            <span className="text-slate-500 uppercase tracking-wider font-bold">Twitter</span>
                                        </div>
                                        <span className="text-slate-300">
                                            {summary.twitter.queriesExecuted} queries • {summary.twitter.postsChecked} checked
                                        </span>
                                    </div>
                                )}
                            </div>

                            <p className="text-[10px] text-slate-500 mt-2.5 font-medium uppercase tracking-wider">
                                Total Checked: {summary.postsChecked} • Took {(summary.durationMs / 1000).toFixed(1)}s
                            </p>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    )
}
