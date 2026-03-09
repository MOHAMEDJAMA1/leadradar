import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Sign in',
    description: 'Sign in to your LeadRadar account.',
}

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/40 px-4 py-16">
            <article className="w-full max-w-md">
                {/* Brand */}
                <header className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-6">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white text-base font-bold shadow-md shadow-indigo-200">
                            L
                        </span>
                        <span className="text-xl font-bold text-foreground tracking-tight">LeadRadar</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                        Sign in to your LeadRadar account.
                    </p>
                </header>

                {/* Card */}
                <section
                    className="bg-card rounded-2xl border border-border p-8 shadow-sm"
                    aria-label="Sign in form"
                >
                    <LoginForm />
                </section>

                {/* Footer */}
                <footer className="text-center mt-6 text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/signup"
                        className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                        Start free trial
                    </Link>
                </footer>
            </article>
        </main>
    )
}
