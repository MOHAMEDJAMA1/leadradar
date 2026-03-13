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
                            <div className="text-sm font-bold text-blue-400 tracking-tight">Lead Inbox</div>
                            <div className="flex gap-2">
                                <div className="h-7 w-20 rounded-lg bg-blue-600/30 border border-blue-500/20" />
                                <div className="h-7 w-16 rounded-lg bg-white/5 border border-white/5" />
                            </div>
                        </div>

                        {/* Lead rows */}
                        <div className="space-y-3">
                            {[
                                { intent: 'HIGH', hot: true, title: 'Need help with SEO for my SaaS project — budget 5k+', sub: 'r/startups', score: 95 },
                                { intent: 'HIGH', hot: true, title: 'Hiring a freelance web developer for a custom dashboard', sub: 'X (Twitter)', score: 92 },
                                { intent: 'MEDIUM', hot: false, title: 'Can anyone recommend a good marketing agency?', sub: 'r/marketing', score: 71 },
                            ].map((lead, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#0c1225] border border-white/5 hover:border-white/10 transition-colors">
                                    {/* Intent dot */}
                                    <div className={`w-1.5 h-8 rounded-full shrink-0 ${lead.intent === 'HIGH' ? 'bg-emerald-500' : 'bg-blue-500'}`} aria-hidden="true" />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {lead.hot && (
                                                <span className="text-[9px] font-bold text-red-400 bg-red-500/15 border border-red-500/20 px-1.5 py-0.5 rounded">
                                                    🔥 HOT LEAD
                                                </span>
                                            )}
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${lead.intent === 'HIGH' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'}`}>
                                                {lead.intent} INTENT
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-300 truncate font-medium">"{lead.title}"</p>
                                        <p className="text-[10px] text-slate-600 mt-0.5 uppercase tracking-wide font-bold">{lead.sub}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="hidden sm:flex gap-1.5 shrink-0">
                                        <button className="px-3 py-1 rounded bg-blue-600/20 border border-blue-500/30 text-[9px] font-bold text-blue-400">
                                            AI Reply
                                        </button>
                                        <div className="w-6 h-6 rounded bg-white/5 border border-white/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Caption */}
                <p className="text-center text-slate-500 text-xs mt-6">
                    LeadRadar organizes detected opportunities into a simple lead inbox.
                </p>
            </div>
        </section>
    )
}
