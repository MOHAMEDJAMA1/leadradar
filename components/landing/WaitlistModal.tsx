'use client'

import { useState, useEffect, useRef } from 'react'
import { joinWaitlist } from '@/app/actions/waitlist'
import { Radar } from 'lucide-react'

interface WaitlistModalProps {
    isOpen: boolean
    onClose: () => void
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [email, setEmail] = useState('')
    const [serviceType, setServiceType] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)
    const emailRef = useRef<HTMLInputElement>(null)

    // Focus email on open
    useEffect(() => {
        if (isOpen && !submitted) {
            setTimeout(() => emailRef.current?.focus(), 50)
        }
    }, [isOpen, submitted])

    // Close on Escape
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    function handleClose() {
        onClose()
        // Reset after animation
        setTimeout(() => {
            setEmail('')
            setServiceType('')
            setError(null)
            setSubmitted(false)
        }, 200)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = await joinWaitlist(email, serviceType)

        if (result.success) {
            setSubmitted(true)
        } else {
            setError(result.error)
        }
        setLoading(false)
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/75 backdrop-blur-sm"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal panel */}
            <div className="relative z-10 w-full max-w-md">
                {/* Glow */}
                <div aria-hidden="true" className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 to-violet-500/20 blur-xl" />

                <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1e] shadow-2xl overflow-hidden">
                    {/* Top gradient bar */}
                    <div aria-hidden="true" className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="p-8">
                        {submitted ? (
                            /* ── Confirmation ── */
                            <div className="text-center py-4">
                                <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/30">
                                    <Radar className="w-7 h-7 text-white" aria-hidden="true" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-3">
                                    You&apos;re on the LeadRadar early access list.
                                </h2>
                                <p className="text-slate-400 text-sm leading-relaxed mb-2">
                                    We&apos;re inviting our first users soon. You&apos;ll be among the first to test the platform.
                                </p>
                                <p className="text-slate-500 text-xs">
                                    We&apos;ll notify you as soon as early access opens.
                                </p>
                                <button
                                    onClick={handleClose}
                                    className="mt-7 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all duration-150 shadow-lg shadow-blue-500/20"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            /* ── Form ── */
                            <>
                                <header className="mb-7">
                                    <div className="flex items-center gap-2 mb-5">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 shadow-md shadow-blue-500/30">
                                            <Radar className="w-4 h-4 text-white" aria-hidden="true" />
                                        </div>
                                        <span className="text-sm font-bold text-white tracking-tight">LeadRadar</span>
                                    </div>
                                    <h2 id="waitlist-modal-title" className="text-2xl font-bold text-white mb-2">
                                        Join the Early Access List
                                    </h2>
                                    <p className="text-slate-400 text-sm">
                                        Get notified when we launch and lock in early adopter pricing.
                                    </p>
                                </header>

                                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                    {/* Email */}
                                    <div>
                                        <label htmlFor="waitlist-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                                            Email address <span className="text-blue-400" aria-label="required">*</span>
                                        </label>
                                        <input
                                            ref={emailRef}
                                            id="waitlist-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@agency.com"
                                            required
                                            disabled={loading}
                                            aria-required="true"
                                            className="w-full h-10 px-3.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors disabled:opacity-50"
                                        />
                                    </div>

                                    {/* Service type */}
                                    <div>
                                        <label htmlFor="waitlist-service" className="block text-xs font-medium text-slate-300 mb-1.5">
                                            What service do you offer?{' '}
                                            <span className="text-slate-600 font-normal">(optional)</span>
                                        </label>
                                        <input
                                            id="waitlist-service"
                                            type="text"
                                            value={serviceType}
                                            onChange={(e) => setServiceType(e.target.value)}
                                            placeholder="Marketing agency, SEO consultant, freelancer, etc."
                                            disabled={loading}
                                            className="w-full h-10 px-3.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors disabled:opacity-50"
                                        />
                                    </div>

                                    {error && (
                                        <p role="alert" className="text-xs text-red-400">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !email}
                                        className="w-full h-11 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-lg shadow-blue-500/20 mt-2"
                                    >
                                        {loading ? 'Joining…' : 'Join Early Access'}
                                    </button>
                                </form>

                                <p className="text-center text-[11px] text-slate-600 mt-5">
                                    No credit card required · Unsubscribe anytime
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
