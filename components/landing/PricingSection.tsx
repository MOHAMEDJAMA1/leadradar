'use client'

import Link from 'next/link'

const plans = [
    {
        name: 'Starter',
        price: '$19',
        period: '/month',
        badge: null,
        features: [
            '3 keywords tracked',
            'Reddit monitoring',
            'Email alerts',
            'Early access pricing',
        ],
        highlight: false,
    },
    {
        name: 'Pro',
        price: '$39',
        period: '/month',
        badge: 'MOST POPULAR',
        features: [
            '10 keywords tracked',
            'Reddit monitoring',
            'AI intent scoring',
            'Lead alerts',
            'Early adopter pricing',
        ],
        highlight: true,
    },
    {
        name: 'Agency',
        price: '$79',
        period: '/month',
        badge: null,
        features: [
            'Unlimited keywords',
            'Team access',
            'Advanced alerts',
            'API access (coming soon)',
        ],
        highlight: false,
    },
]

export function PricingSection() {
    return (
        <section id="pricing" className="py-24 px-6 border-t border-white/5" aria-labelledby="pricing-heading">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="text-center mb-14">
                    <h2 id="pricing-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Simple, transparent pricing.
                    </h2>
                    <p className="text-slate-400 text-base">
                        Choose the plan that fits your growth stage.
                    </p>
                </header>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-5 items-stretch">
                    {plans.map(({ name, price, period, badge, features, highlight }) => (
                        <article
                            key={name}
                            className={`relative flex flex-col p-7 rounded-2xl border transition-all duration-200 ${highlight
                                ? 'border-blue-500/50 bg-gradient-to-b from-blue-950/60 to-[#0a0f1e] shadow-2xl shadow-blue-500/10 scale-[1.025]'
                                : 'border-white/8 bg-[#0a0f1e] hover:border-white/15'
                                }`}
                        >
                            {/* Popular badge */}
                            {badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[10px] font-bold tracking-widest uppercase shadow-lg">
                                        {badge}
                                    </span>
                                </div>
                            )}

                            <header className="mb-6">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">{name}</h3>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-bold text-white">{price}</span>
                                    <span className="text-slate-500 text-sm mb-1">{period}</span>
                                </div>
                            </header>

                            {/* Features */}
                            <ul className="flex-1 space-y-3 mb-8" aria-label={`${name} plan features`}>
                                {features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                                        <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/signup"
                                className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-all duration-150 ${highlight
                                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                    }`}
                            >
                                Start Finding Leads
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
