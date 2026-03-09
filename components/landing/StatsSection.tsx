const stats = [
    { value: '500+', label: 'Communities Monitored', color: 'text-white' },
    { value: '10,000+', label: 'Buying Signals Detected Weekly', color: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400' },
    { value: 'First to Reply', label: 'Average Response Time Advantage', color: 'text-white' },
]

export function StatsSection() {
    return (
        <section className="py-20 px-6 border-t border-white/5" aria-label="Statistics">
            <div className="max-w-5xl mx-auto">
                <dl className="grid sm:grid-cols-3 gap-5">
                    {stats.map(({ value, label, color }) => (
                        <div
                            key={label}
                            className="flex flex-col items-center justify-center py-10 px-6 rounded-2xl border border-white/8 bg-[#0a0f1e] text-center"
                        >
                            <dt className={`text-3xl md:text-4xl font-bold mb-2 ${color}`}>
                                {value}
                            </dt>
                            <dd className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                {label}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}
