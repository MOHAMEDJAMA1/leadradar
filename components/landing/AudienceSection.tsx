const audiences = [
    {
        title: 'Marketing Agencies',
        text: 'Find companies actively looking for paid media, marketing, and creative help.',
        icon: '📣',
    },
    {
        title: 'SEO Consultants',
        text: 'Detect businesses asking for SEO and search recommendations in real time.',
        icon: '🔍',
    },
    {
        title: 'Freelancers',
        text: 'Discover clients asking for hands-on help in places before they come to job boards.',
        icon: '🧑‍💻',
    },
    {
        title: 'Consultants',
        text: 'Identify high-value strategy and advisory requests from founders across social and forums.',
        icon: '📊',
    },
]

export function AudienceSection() {
    return (
        <section className="py-24 px-6 border-t border-white/5" aria-labelledby="audience-heading">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="text-center mb-16">
                    <h2 id="audience-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Who LeadRadar is for
                    </h2>
                    <p className="text-slate-400 text-base">
                        Precision-targeted lead tools for service-based businesses.
                    </p>
                </header>

                {/* Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {audiences.map(({ title, text, icon }) => (
                        <article
                            key={title}
                            className="p-6 rounded-2xl border border-white/8 bg-[#0a0f1e] hover:border-white/15 hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="text-2xl mb-4" aria-hidden="true">{icon}</div>
                            <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
