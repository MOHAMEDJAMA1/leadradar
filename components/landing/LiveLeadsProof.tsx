import { Flame, Twitter, Globe2 } from 'lucide-react'

const EXAMPLE_LEADS = [
    {
        platform: 'reddit',
        community: 'r/startups',
        content: 'Need help with SEO for my SaaS.',
        intent: 'High',
        icon: <Globe2 className="w-4 h-4 text-orange-500" />
    },
    {
        platform: 'twitter',
        community: 'X (Twitter)',
        content: 'Looking for a freelance web developer for my startup.',
        intent: 'High',
        icon: <Twitter className="w-4 h-4 text-[#1DA1F2]" />
    },
    {
        platform: 'reddit',
        community: 'r/marketing',
        content: 'Can someone recommend a marketing agency?',
        intent: 'Medium',
        icon: <Globe2 className="w-4 h-4 text-orange-500" />
    }
]

export function LiveLeadsProof() {
    return (
        <section className="py-20 px-6 bg-[#080d1a]/50 border-y border-white/5" aria-labelledby="proof-heading">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 id="proof-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Real Leads Detected by LeadRadar
                    </h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">
                        We monitor Reddit and X 24/7 to find your next customer the moment they post.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {EXAMPLE_LEADS.map((lead, i) => (
                        <div key={i} className="group relative p-6 rounded-2xl border border-white/8 bg-[#0a0f1e] hover:border-blue-500/30 transition-all duration-300">
                            {/* Example Label */}
                            <span className="absolute top-4 right-5 text-[9px] font-black uppercase tracking-widest text-slate-600 bg-white/5 px-2 py-0.5 rounded">
                                Example Lead Detected
                            </span>

                            {/* Platform Info */}
                            <div className="flex items-center gap-2 mb-4">
                                {lead.icon}
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                    {lead.community}
                                </span>
                            </div>

                            {/* Lead Content */}
                            <p className="text-sm font-medium text-white mb-6 leading-relaxed">
                                &ldquo;{lead.content}&rdquo;
                            </p>

                            {/* Intent Level */}
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${lead.intent === 'High' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        Intent Level: <span className={lead.intent === 'High' ? 'text-emerald-400' : 'text-blue-400'}>{lead.intent}</span>
                                    </span>
                                </div>
                                {lead.intent === 'High' && (
                                    <Flame className="w-4 h-4 text-red-500" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
