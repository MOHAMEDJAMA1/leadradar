'use client'

import { useState } from 'react'
import { WaitlistModal } from '@/components/landing/WaitlistModal'

export function HeroSection() {
    const [waitlistOpen, setWaitlistOpen] = useState(false)

    return (
        <>
            <section
                id="hero"
                className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden"
                aria-label="Hero"
            >
                {/* Background glow orbs */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
                    <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* Announcement badges */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
                            NOW SCANNING REDDIT, X &amp; LINKEDIN
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" aria-hidden="true" />
                            AI-POWERED SIGNALS. REAL OUTBOUND POWER.
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
                        Find people already asking<br />
                        for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400">
                            your service online.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        LeadRadar scans online communities and detects high-intent posts where people are looking for services like yours.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setWaitlistOpen(true)}
                            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                        >
                            Join Early Access
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            View Demo
                        </button>
                    </div>
                </div>
            </section>

            <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
        </>
    )
}
