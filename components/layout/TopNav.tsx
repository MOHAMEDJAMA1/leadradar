'use client'

import { useState, useEffect } from 'react'
import { Bell, Rocket, Menu } from 'lucide-react'
import { triggerScan } from '@/app/actions/scan'
import { getUnreadAlertsCount } from '@/app/actions/alerts'
import { ScanResultBanner } from '@/components/dashboard/ScanResultBanner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface TopNavProps {
    userName?: string
    userRole?: string
    lastScanAt?: string | null
    onMenuClick?: () => void
}

export function TopNav({ userName = 'User', userRole = 'MEMBER', lastScanAt, onMenuClick }: TopNavProps) {
    const router = useRouter()
    const [isScanning, setIsScanning] = useState(false)
    const [scanSummary, setScanSummary] = useState<any>(null)
    const [scanError, setScanError] = useState<string | null>(null)
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        getUnreadAlertsCount().then(res => {
            if (res.success) setUnreadCount(res.count || 0)
        })
    }, [])

    const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    async function handleScan() {
        if (isScanning) return
        setIsScanning(true)
        setScanSummary(null)
        setScanError(null)

        const result = await triggerScan()
        if (result.success && result.data) {
            setScanSummary(result.data)
            // Refresh alert count
            getUnreadAlertsCount().then(res => {
                if (res.success) setUnreadCount(res.count || 0)
            })
            // Refresh the current page to pull new leads into the inbox
            router.refresh()
        } else {
            setScanError(result.error || 'Failed to scan')
        }
        setIsScanning(false)
    }

    return (
        <header className="h-14 flex items-center gap-4 sm:gap-6 px-4 sm:px-6 bg-[#0d1117] border-b border-white/5 z-20 shrink-0">
            {/* Mobile menu toggle & Logo */}
            <div className="flex items-center gap-3 lg:hidden">
                <button 
                    onClick={onMenuClick}
                    className="p-1.5 -ml-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 overflow-hidden border border-white/10 shrink-0">
                        <img src="/logo.png" alt="" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Global search */}
            <div className="relative w-full max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                    type="search"
                    placeholder="Search leads, keywords, communities..."
                    aria-label="Global search"
                    className="w-full h-9 pl-9 pr-4 rounded-lg border border-white/8 bg-white/4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
            </div>

            {/* Scan button */}
            <button
                onClick={handleScan}
                disabled={isScanning}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/20 transition-all duration-150 shrink-0 whitespace-nowrap disabled:opacity-50"
            >
                <Rocket className={`w-3.5 h-3.5 ${isScanning ? 'animate-pulse' : ''}`} aria-hidden="true" />
                {isScanning ? 'Scanning…' : 'Scan Communities'}
            </button>

            {/* Push user section to far right */}
            <div className="flex-1" />

            {/* Last Scan Status */}
            {lastScanAt && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span suppressHydrationWarning className="text-xs font-semibold text-slate-400">
                        Scan: {formatDistanceToNow(new Date(lastScanAt), { addSuffix: true })}
                    </span>
                </div>
            )}

            {/* Bell */}
            <Link href="/alerts" className="relative p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors" aria-label="Notifications">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" aria-hidden="true" />
                    </span>
                )}
            </Link>

            {/* Separator */}
            <div className="w-px h-5 bg-white/8" aria-hidden="true" />

            {/* User */}
            <div className="flex items-center gap-3 shrink-0">
                <div
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white text-xs font-bold shrink-0"
                    aria-hidden="true"
                >
                    {initials}
                </div>
                <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-white leading-none">{userName}</p>
                </div>
            </div>

            {/* Scan Result Overlay */}
            <ScanResultBanner
                summary={scanSummary}
                error={scanError}
                onDismiss={() => { setScanSummary(null); setScanError(null) }}
            />
        </header>
    )
}
