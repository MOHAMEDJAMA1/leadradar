export function ProductPreview() {
    return (
        <section className="px-6 pb-24" aria-label="Product preview">
            <div className="max-w-5xl mx-auto">
                <div className="relative rounded-2xl border border-white/8 bg-[#0a0f1e] overflow-hidden shadow-2xl shadow-blue-500/5">
                    {/* Glow at top */}
                    <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

                    {/* Browser chrome bar */}
                    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-[#060b18]">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" aria-hidden="true" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" aria-hidden="true" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" aria-hidden="true" />
                        <div className="flex-1 mx-4">
                            <div className="max-w-xs mx-auto h-5 rounded bg-white/5 border border-white/5 flex items-center px-3">
                                <span className="text-[10px] text-slate-600">app.leadradar.io/inbox</span>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard mock content */}
                    <div className="p-4 md:p-6 bg-[#060b18] min-h-[340px]">
                        {/* Top bar */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="h-4 w-28 rounded bg-white/5" />
                            <div className="flex gap-2">
                                <div className="h-7 w-20 rounded-lg bg-blue-600/30 border border-blue-500/20" />
                                <div className="h-7 w-16 rounded-lg bg-white/5 border border-white/5" />
                            </div>
                        </div>

                        {/* Lead rows */}
                        <div className="space-y-3">
                            {[
                                { intent: 'HIGH', hot: true, title: 'Looking for a marketing agency to run Facebook ads — budget confirmed', sub: 'r/smallbusiness', score: 94 },
                                { intent: 'HIGH', hot: true, title: 'Need help with Google Ads, hiring a PPC specialist ASAP', sub: 'r/entrepreneur', score: 88 },
                                { intent: 'MEDIUM', hot: false, title: 'Anyone recommend a good SEO agency? Been burned before', sub: 'r/SEO', score: 71 },
                                { intent: 'HIGH', hot: true, title: 'Looking for a Shopify development agency for a full rebrand', sub: 'r/ecommerce', score: 85 },
                                { intent: 'MEDIUM', hot: false, title: 'What agencies are good for programmatic advertising?', sub: 'r/PPC', score: 65 },
                            ].map((lead, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#0c1225] border border-white/5 hover:border-white/10 transition-colors">
                                    {/* Intent dot */}
                                    <div className={`w-1.5 h-8 rounded-full shrink-0 ${lead.intent === 'HIGH' ? 'bg-emerald-500' : 'bg-amber-500'}`} aria-hidden="true" />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {lead.hot && (
                                                <span className="text-[9px] font-bold text-orange-400 bg-orange-500/15 border border-orange-500/20 px-1.5 py-0.5 rounded">
                                                    🔥 HOT
                                                </span>
                                            )}
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${lead.intent === 'HIGH' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                                                {lead.intent}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-300 truncate">{lead.title}</p>
                                        <p className="text-[10px] text-slate-600 mt-0.5">{lead.sub}</p>
                                    </div>

                                    {/* Score */}
                                    <div className="shrink-0 text-right">
                                        <div className="text-sm font-bold text-blue-400">{lead.score}%</div>
                                        <div className="text-[9px] text-slate-600">intent</div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1.5 shrink-0">
                                        <div className="w-6 h-6 rounded bg-white/5 border border-white/5" />
                                        <div className="w-6 h-6 rounded bg-white/5 border border-white/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
