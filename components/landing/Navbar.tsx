'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Radar } from 'lucide-react'
import { WaitlistModal } from '@/components/landing/WaitlistModal'

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [waitlistOpen, setWaitlistOpen] = useState(false)

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050810]/80 backdrop-blur-xl">
                <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between" aria-label="Main navigation">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
                            <Radar className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">LeadRadar</span>
                    </Link>

                    {/* Desktop nav */}
                    <ul className="hidden md:flex items-center gap-8 text-sm text-slate-400">
                        {['Features', 'How It Works', 'Pricing', 'Login'].map((item) => (
                            <li key={item}>
                                <Link
                                    href={item === 'Login' ? '/login' : `#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="hover:text-white transition-colors duration-150"
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <div className="hidden md:flex items-center">
                        <button
                            onClick={() => setWaitlistOpen(true)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white transition-all duration-150 shadow-lg shadow-blue-500/20"
                        >
                            Join Early Access
                        </button>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden text-slate-400 hover:text-white"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </nav>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden bg-[#080d1a] border-t border-white/5 px-6 py-4 flex flex-col gap-4 text-sm text-slate-300">
                        {['Features', 'How It Works', 'Pricing', 'Login'].map((item) => (
                            <Link key={item} href={item === 'Login' ? '/login' : '#'} onClick={() => setMobileOpen(false)} className="hover:text-white transition-colors">
                                {item}
                            </Link>
                        ))}
                        <button
                            onClick={() => { setMobileOpen(false); setWaitlistOpen(true) }}
                            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                        >
                            Join Early Access
                        </button>
                    </div>
                )}
            </header>

            <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
        </>
    )
}
