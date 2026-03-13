import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export function FinalCTA() {
    return (
        <section className="py-28 px-6 border-t border-white/5 relative overflow-hidden" aria-labelledby="final-cta-heading">
            {/* Glow */}
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute w-[300px] h-[200px] bg-violet-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 id="final-cta-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                    Start Finding Clients Today
                </h2>
                
                {/* Trust signals */}
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-12">
                   <div className="flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Reddit + X monitoring</span>
                   </div>
                   <div className="flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">AI-powered detection</span>
                   </div>
                   <div className="flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                       <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time alerts</span>
                   </div>
                </div>

                <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200"
                >
                    Try LeadRadar
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>
            </div>
        </section>
    )
}
