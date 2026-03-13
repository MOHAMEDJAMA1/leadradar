import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Radar } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Sign in — LeadRadar',
    description: 'Sign in to your LeadRadar account.',
}

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4 py-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <article className="relative z-10 w-full max-w-md">
                {/* Brand */}
                <header className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-7 group">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                            <Radar className="w-5 h-5 text-white" aria-hidden="true" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">LeadRadar</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                    <p className="text-slate-500 mt-1.5 text-sm">Sign in to your LeadRadar account</p>
                </header>

                {/* Card */}
                <section
                    className="rounded-2xl border border-white/8 bg-[#111827] p-8 shadow-2xl shadow-black/40"
                    aria-label="Sign in form"
                >
                    <LoginForm />
                </section>

                {/* Footer */}
                <footer className="text-center mt-6 text-sm text-slate-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Start free trial
                    </Link>
                </footer>
            </article>
        </main>
    )
}
