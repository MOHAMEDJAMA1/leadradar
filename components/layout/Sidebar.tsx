'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Inbox,
    BookMarked,
    Globe,
    Settings,
    LogOut,
    Radar,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/leads', label: 'Lead Inbox', icon: Inbox, badge: 'Soon' },
    { href: '/keywords', label: 'Keywords', icon: BookMarked, badge: 'Soon' },
    { href: '/communities', label: 'Communities', icon: Globe, badge: 'Soon' },
    { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <aside
            className="flex flex-col w-64 min-h-screen bg-slate-950 border-r border-slate-800 shrink-0"
            aria-label="Main navigation"
        >
            {/* Brand */}
            <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-800">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 shadow-md shadow-indigo-900/50">
                    <Radar className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">LeadRadar</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Primary navigation">
                {navItems.map(({ href, label, icon: Icon, badge }) => {
                    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100
                ${isActive
                                    ? 'bg-indigo-600/20 text-indigo-300'
                                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                                }
              `}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon
                                className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                                aria-hidden="true"
                            />
                            <span className="flex-1">{label}</span>
                            {badge && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-500 border border-slate-700">
                                    {badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Sign out */}
            <div className="px-3 py-4 border-t border-slate-800">
                <button
                    onClick={handleSignOut}
                    className="group flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 transition-colors duration-100"
                    aria-label="Sign out of LeadRadar"
                >
                    <LogOut className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-300" aria-hidden="true" />
                    Sign out
                </button>
            </div>
        </aside>
    )
}
