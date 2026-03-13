import Link from 'next/link'

export function HeroSection() {
    return (
        <section
            id="hero"
            className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden"
            aria-label="Hero"
        >
            {/* Background glow orbs */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Announcement badges */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
                        NOW SCANNING REDDIT, X &amp; LINKEDIN
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" aria-hidden="true" />
                        AI-POWERED SIGNALS. REAL OUTBOUND POWER.
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
                    Find People Asking For<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400">
                        Your Services Online.
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    LeadRadar detects real posts from Reddit and X where people are looking for services like SEO, marketing, and web development.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/signup"
                        className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                    >
                        Start Finding Leads
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200">
                        View Demo
                    </button>
                </div>
            </div>
        </section>
    )
}
