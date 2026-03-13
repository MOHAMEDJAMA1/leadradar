'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Bell, Check, Trash2, ExternalLink, Twitter, Globe2 } from 'lucide-react'
import { markAlertRead, markAllAlertsRead, clearReadAlerts } from '@/app/actions/alerts'
import Link from 'next/link'

interface Alert {
    id: string
    title: string
    message: string
    is_read: boolean
    created_at: string
    lead_id: string | null
}

export function AlertsClient({ initialAlerts }: { initialAlerts: Alert[] }) {
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
    const [isMarkingAll, setIsMarkingAll] = useState(false)
    const [isClearing, setIsClearing] = useState(false)

    const unreadCount = alerts.filter(a => !a.is_read).length

    async function handleMarkRead(id: string) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a))
        await markAlertRead(id)
    }

    async function handleMarkAllRead() {
        setIsMarkingAll(true)
        setAlerts(prev => prev.map(a => ({ ...a, is_read: true })))
        await markAllAlertsRead()
        setIsMarkingAll(false)
    }

    async function handleClearRead() {
        setIsClearing(true)
        setAlerts(prev => prev.filter(a => !a.is_read))
        await clearReadAlerts()
        setIsClearing(false)
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <header className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Bell className="w-6 h-6 text-blue-400" />
                        Alerts Center
                    </h1>
                    <p className="text-slate-400 mt-1">Review your latest automated lead notifications.</p>
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={isMarkingAll}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/8 transition-colors disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" />
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={handleClearRead}
                        disabled={isClearing || alerts.filter(a => a.is_read).length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/8 transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear read alerts
                    </button>
                </div>
            </header>

            <div className="bg-[#111827] rounded-2xl border border-white/8 overflow-hidden">
                {alerts.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">No alerts yet</h3>
                        <p className="text-slate-500 max-w-sm">
                            When automatic scanning finds new leads matching your keywords, they will appear here.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-white/5">
                        {alerts.map((alert) => (
                            <li
                                key={alert.id}
                                className={`p-5 flex gap-4 transition-colors ${!alert.is_read ? 'bg-blue-950/20' : 'hover:bg-white/[0.02]'}`}
                                onClick={() => {
                                    if (!alert.is_read) handleMarkRead(alert.id)
                                }}
                            >
                                <div className="mt-1 flex-shrink-0">
                                    {!alert.is_read ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    ) : (
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {alert.title.toLowerCase().includes('twitter') ? (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#1DA1F2] bg-[#1DA1F2]/10 px-1.5 py-0.5 rounded border border-[#1DA1F2]/20">
                                                        <Twitter className="w-3 h-3" /> X (TWITTER)
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                                                        <Globe2 className="w-3 h-3" /> REDDIT
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-sm font-bold ${!alert.is_read ? 'text-white' : 'text-slate-300'}`}>
                                                {alert.title}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-400">
                                                {alert.message}
                                            </p>
                                        </div>
                                        <span className="text-xs text-slate-500 whitespace-nowrap">
                                            {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    {alert.lead_id && (
                                        <div className="mt-3">
                                            <Link
                                                href={`/leads?id=${alert.lead_id}&tab=all`}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                                onClick={(e) => {
                                                    if (!alert.is_read) handleMarkRead(alert.id)
                                                }}
                                            >
                                                View Lead <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
