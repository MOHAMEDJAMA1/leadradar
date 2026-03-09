import Link from 'next/link'
import { Radar } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#050810]" aria-label="Site footer">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600">
                            <Radar className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">LeadRadar</span>
                    </Link>

                    {/* Center links */}
                    <nav aria-label="Footer navigation">
                        <ul className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
                            {['Terms', 'Privacy', 'Cookies', 'Support'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-slate-300 transition-colors duration-150">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Social icons */}
                    <div className="flex items-center gap-3" aria-label="Social media links">
                        {/* X / Twitter */}
                        <a href="#" className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-150" aria-label="Follow on X / Twitter">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="#" className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-150" aria-label="Follow on LinkedIn">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-slate-600">
                    © 2026 LeadRadar Inc. All rights reserved. Built for the future of outbound.
                </div>
            </div>
        </footer>
    )
}
