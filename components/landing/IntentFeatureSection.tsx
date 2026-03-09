export function IntentFeatureSection() {
    return (
        <section className="py-24 px-6 border-t border-white/5" aria-labelledby="intent-heading">
            <div className="max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Left */}
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-6 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[11px] font-bold tracking-wide">
                            🔥 HOT LEAD DETECTED
                        </span>
                        <h2 id="intent-heading" className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
                            Catch them at the<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                                moment of intent.
                            </span>
                        </h2>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            Stop cold calling. Start responding to people who are already looking for exactly what you sell.
                        </p>
                        <div className="flex items-center gap-3 mt-auto">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                JW
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">James Wilson</div>
                                <div className="text-xs text-slate-400">COO @ SaaS Startup</div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Social post card */}
                    <div className="relative">
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-violet-600/10 rounded-3xl blur-2xl" />
                        <article className="relative p-6 rounded-2xl border border-white/10 bg-[#0c1225] shadow-2xl">
                            {/* Post header */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                        JD
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-white">@user</div>
                                        <div className="text-[10px] text-slate-500">2h ago</div>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59l-.047-.02z" /></svg>
                                    RETWEET
                                </span>
                            </div>

                            {/* Post text */}
                            <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                Hey everyone, we&apos;re scaling fast and our current CRM is a mess. Does anyone have a recommendation for a CRM that handles complex B2B sales cycles?{' '}
                                <span className="text-blue-400">Budget is flexible</span> for the right tool.
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                                    HIGH INTENT
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 text-[10px] font-bold uppercase tracking-wide">
                                    🔥 HOT LEAD
                                </span>
                            </div>

                            {/* Action */}
                            <button className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all duration-150 shadow-lg shadow-blue-500/20">
                                Draft Reply
                            </button>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    )
}
