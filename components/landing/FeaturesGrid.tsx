const features = [
    {
        icon: (
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
        ),
        title: 'Intent Detection',
        text: 'AI analysis to separate genuine inquiries from casual discussion.',
    },
    {
        icon: (
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
        ),
        title: 'Community Monitoring',
        text: 'Real-time tracking of 500+ communities and sub-forums.',
    },
    {
        icon: (
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
        title: 'Lead Intelligence',
        text: 'Get company size, role, and historical context on the lead.',
    },
    {
        icon: (
            <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
        ),
        title: 'Hot Lead Alerts',
        text: 'Instant Slack or email notifications for high-priority matches.',
    },
]

export function FeaturesGrid() {
    return (
        <section id="features" className="py-24 px-6 border-t border-white/5" aria-labelledby="features-heading">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-14">
                    <h2 id="features-heading" className="text-2xl font-bold text-white mb-3">
                        Everything you need to win more business
                    </h2>
                    <p className="text-slate-400 text-sm">Built for high-velocity outbound teams.</p>
                </header>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {features.map(({ icon, title, text }) => (
                        <article
                            key={title}
                            className="p-6 rounded-2xl border border-white/8 bg-[#0a0f1e] hover:border-white/15 hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/8 mb-4">
                                {icon}
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
