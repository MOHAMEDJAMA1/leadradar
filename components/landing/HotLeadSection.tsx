export function HotLeadSection() {
    return (
        <section className="py-24 px-6 border-t border-white/5" aria-labelledby="hot-lead-heading">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="text-center mb-12">
                    <h2 id="hot-lead-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Spot high-value opportunities instantly.
                    </h2>
                    <p className="text-slate-400 text-base max-w-xl mx-auto">
                        LeadRadar detects strong buying intent and highlights the most valuable opportunities.
                    </p>
                </header>

                {/* Featured lead card */}
                <div className="max-w-xl mx-auto">
                    <div className="relative p-6 rounded-2xl border border-white/10 bg-[#0c1225] shadow-2xl overflow-hidden">
                        {/* Background glow */}
                        <div aria-hidden="true" className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />

                        {/* Hot badge */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold">
                                🔥 HOT LEAD
                            </span>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                    92%
                                </div>
                                <div className="text-[10px] text-slate-500">Intent Score</div>
                            </div>
                        </div>

                        {/* Post text */}
                        <p className="text-base font-semibold text-white mb-4 leading-snug">
                            &ldquo;Looking for a marketing agency to run Facebook ads&rdquo;
                        </p>

                        {/* Supporting text */}
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            AI analyzed post in 23 intent factors
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
