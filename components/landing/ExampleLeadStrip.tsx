export function ExampleLeadStrip() {
    return (
        <section className="px-6 pb-12" aria-label="Example lead detection">
            <div className="max-w-4xl mx-auto">
                {/* Label */}
                <p className="text-center text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-4">
                    Example Opportunity LeadRadar Detected
                </p>

                {/* Lead card */}
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border border-white/8 bg-[#0c1123]/80 backdrop-blur-sm shadow-xl shadow-black/30">
                    {/* Left glow */}
                    <div aria-hidden="true" className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-16 bg-orange-500/10 rounded-full blur-2xl" />

                    <div className="flex-1 min-w-0">
                        {/* Hot lead badge */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-bold tracking-wide">
                                🔥 HOT LEAD
                            </span>
                        </div>

                        {/* Post text */}
                        <p className="text-white text-sm font-medium leading-snug mb-3">
                            &ldquo;SaaS founder looking for a marketing agency to run Facebook ads&rdquo;
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-semibold uppercase tracking-wide">
                                HIGH INTENT
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-medium">
                                r/startups
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-medium">
                                marketing agency
                            </span>
                        </div>
                    </div>

                    {/* Action button */}
                    <button className="shrink-0 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-all duration-150">
                        View Original Post →
                    </button>
                </div>
            </div>
        </section>
    )
}
