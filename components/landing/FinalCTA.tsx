'use client'

import { useState } from 'react'
import { WaitlistModal } from '@/components/landing/WaitlistModal'

export function FinalCTA() {
    const [waitlistOpen, setWaitlistOpen] = useState(false)

    return (
        <>
            <section className="py-28 px-6 border-t border-white/5 relative overflow-hidden" aria-labelledby="final-cta-heading">
                {/* Glow */}
                <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
                    <div className="absolute w-[300px] h-[200px] bg-violet-600/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <h2 id="final-cta-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                        Ready to find your<br />next big customer?
                    </h2>
                    <p className="text-slate-400 text-base mb-10">
                        Join 1,000+ sales teams using LeadRadar to win high-intent deals.
                    </p>
                    <button
                        onClick={() => setWaitlistOpen(true)}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200"
                    >
                        Join the Waitlist
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </section>

            <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
        </>
    )
}
