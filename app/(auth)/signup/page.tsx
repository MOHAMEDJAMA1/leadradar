import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'
import { Radar } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Create your account — LeadRadar',
    description: 'Start your free LeadRadar trial. Find high-intent leads from online communities.',
}

export default function SignupPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4 py-16 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <article className="relative z-10 w-full max-w-md">
                {/* Brand */}
                <header className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-7 group">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                            <Radar className="w-5 h-5 text-white" aria-hidden="true" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">LeadRadar</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Create your account</h1>
                    <p className="text-slate-500 mt-1.5 text-sm">
                        Start finding leads in minutes. No credit card required.
                    </p>
                </header>

                {/* Card */}
                <section
                    className="rounded-2xl border border-white/8 bg-[#111827] p-8 shadow-2xl shadow-black/40"
                    aria-label="Sign up form"
                >
                    <SignupForm />
                </section>

                {/* Footer */}
                <footer className="text-center mt-6 text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        Sign in
                    </Link>
                </footer>
            </article>
        </main>
    )
}
