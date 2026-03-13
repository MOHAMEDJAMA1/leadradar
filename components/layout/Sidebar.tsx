'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard, Users, Key, Globe2, Bell,
    Settings, Radar, LogOut, ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Leads', href: '/leads', icon: Users },
    { label: 'Keywords', href: '/keywords', icon: Key },
    { label: 'Communities', href: '/communities', icon: Globe2 },
    { label: 'Alerts', href: '/alerts', icon: Bell },
]

export function Sidebar() {
    const pathname = usePathname()
    const [signingOut, setSigningOut] = useState(false)

    async function handleSignOut() {
        setSigningOut(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    return (
        <aside className="fixed left-0 top-0 h-full w-[220px] flex flex-col bg-[#111827] border-r border-white/5 z-40">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 h-14 border-b border-white/5 shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
                    <Radar className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">LeadRadar</span>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || pathname.startsWith(href + '/')
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${active
                                ? 'bg-blue-600/20 text-blue-400 shadow-sm'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            aria-current={active ? 'page' : undefined}
                        >
                            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} aria-hidden="true" />
                            {label}
                            {active && <ChevronRight className="w-3 h-3 ml-auto text-blue-500/60" aria-hidden="true" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom section */}
            <div className="px-3 pb-4 space-y-0.5 shrink-0 border-t border-white/5 pt-3">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <Settings className="w-4 h-4 text-slate-500" aria-hidden="true" />
                    Settings
                </Link>

                {/* Plan card */}
                <div className="mt-3 mx-0 p-3 rounded-xl bg-white/4 border border-white/8">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mb-1">Current Plan</p>
                    <p className="text-sm font-bold text-white mb-2">Enterprise Pro</p>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} aria-label="75% of credits used">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1.5">75% of credits used</p>
                </div>

                <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/8 transition-colors mt-1 disabled:opacity-50"
                    aria-label="Sign out"
                >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
            </div>
        </aside>
    )
}
