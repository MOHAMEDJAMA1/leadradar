import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Create your account',
    description: 'Start your free LeadRadar trial. Find high-intent leads from online communities.',
}

export default function SignupPage() {
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
                    <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                    <p className="text-muted-foreground mt-1.5 text-sm">
                        Start finding leads in minutes. No credit card required.
                    </p>
                </header>

                {/* Card */}
                <section
                    className="bg-card rounded-2xl border border-border p-8 shadow-sm"
                    aria-label="Sign up form"
                >
                    <SignupForm />
                </section>

                {/* Footer */}
                <footer className="text-center mt-6 text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                        Sign in
                    </Link>
                </footer>
            </article>
        </main>
    )
}
