'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const GoogleIcon = () => (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
)

const inputCls = "w-full h-11 px-3.5 rounded-xl border border-white/8 bg-white/4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-colors disabled:opacity-50"
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5"

export function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [oauthLoading, setOauthLoading] = useState(false)

    const supabase = createClient()

    async function handleEmailLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { setError(error.message); setLoading(false); return }
        router.push('/dashboard')
        router.refresh()
    }

    async function handleGoogleLogin() {
        setOauthLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${location.origin}/auth/callback?next=/dashboard` },
        })
        if (error) { setError(error.message); setOauthLoading(false) }
    }

    return (
        <div className="space-y-5">
            {/* Google */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={oauthLoading || loading}
                aria-label="Sign in with Google"
                className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-300 hover:bg-white/8 hover:text-white transition-colors disabled:opacity-50"
            >
                <GoogleIcon />
                {oauthLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-white/8" aria-hidden="true" />
                <span className="text-xs text-slate-600">or sign in with email</span>
                <div className="flex-1 h-px bg-white/8" aria-hidden="true" />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
                <div>
                    <label htmlFor="login-email" className={labelCls}>Email address</label>
                    <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@agency.com" required autoComplete="email" disabled={loading} aria-required="true" className={inputCls} />
                </div>
                <div>
                    <label htmlFor="login-password" className={labelCls}>Password</label>
                    <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required autoComplete="current-password" disabled={loading} aria-required="true" className={inputCls} />
                </div>

                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

                <button
                    type="submit"
                    disabled={loading || oauthLoading}
                    className="w-full h-11 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all duration-150"
                >
                    {loading ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    )
}
