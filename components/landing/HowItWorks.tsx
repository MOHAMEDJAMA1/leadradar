const steps = [
    {
        icon: (
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Keywords',
        text: 'Define the freelancers, competitors, and niche services you offer. Our AI understands context, not just words.',
    },
    {
        icon: (
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        ),
        title: 'Scanning',
        text: 'Our AI monitors Reddit, X, LinkedIn, and niche forums 24/7. We filter the noise and find the gold.',
    },
    {
        icon: (
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
            </svg>
        ),
        title: 'Lead Inbox',
        text: 'High-quality leads delivered straight to your desk with AI-crafted response ready to go.',
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-6 border-t border-white/5" aria-labelledby="how-it-works-heading">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="text-center mb-16">
                    <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Three steps to find clients already looking for you.
                    </h2>
                    <p className="text-slate-400 text-base max-w-xl mx-auto">
                        Automate your lead sourcing with AI-powered intent detection.
                    </p>
                </header>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-5">
                    {steps.map(({ icon, title, text }, i) => (
                        <article
                            key={title}
                            className="relative p-6 rounded-2xl border border-white/8 bg-[#0a0f1e] hover:border-white/15 hover:-translate-y-1 transition-all duration-200 group"
                        >
                            {/* Step number */}
                            <div className="absolute top-4 right-5 text-xs font-bold text-white/10 group-hover:text-white/20 transition-colors">
                                0{i + 1}
                            </div>

                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/8 mb-5">
                                {icon}
                            </div>

                            <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
