const steps = [
    {
        title: 'Add your service keywords',
        text: 'Example: SEO, marketing, web developer. Our AI understands the context of the services you offer.',
    },
    {
        title: 'LeadRadar scans communities',
        text: 'Reddit + X monitored automatically 24/7. We scan thousands of posts to find high-intent requests.',
    },
    {
        title: 'Capture the lead',
        text: 'Get instant alerts and AI-generated reply suggestions to win the deal before your competitors.',
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-6 border-t border-white/5" aria-labelledby="how-it-works-heading">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-16">
                    <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-slate-400 text-base max-w-xl mx-auto">
                        Stop manual searching. Automate your lead sourcing in three simple steps.
                    </p>
                </header>

                <div className="grid md:grid-cols-3 gap-5">
                    {steps.map(({ title, text }, i) => (
                        <article
                            key={title}
                            className="relative p-8 rounded-2xl border border-white/8 bg-[#0a0f1e] hover:border-blue-500/20 transition-all duration-200"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold mb-6">
                                {i + 1}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
