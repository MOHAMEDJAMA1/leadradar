'use client'

import { useState } from 'react'
import { BUSINESS_TYPES } from '@/lib/constants/businessTypes'
import { saveBusinessType } from '@/app/actions/onboarding'
import { Button } from '@/components/ui/button'

export function BusinessTypeStep() {
    const [selected, setSelected] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleContinue() {
        if (!selected) return
        setLoading(true)
        setError(null)
        try {
            await saveBusinessType(selected)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Options grid */}
            <fieldset>
                <legend className="sr-only">Select your business type</legend>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    role="radiogroup"
                    aria-label="Business type options"
                >
                    {BUSINESS_TYPES.map(({ id, label, description, icon }) => {
                        const isSelected = selected === id
                        return (
                            <button
                                key={id}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => setSelected(id)}
                                className={`
                  group flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-100
                  ${isSelected
                                        ? 'border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-100'
                                        : 'border-border bg-card hover:border-indigo-200 hover:bg-indigo-50/40'
                                    }
                `}
                            >
                                {/* Check indicator */}
                                <div
                                    className={`
                    flex items-center justify-center w-5 h-5 mt-0.5 rounded-full border-2 shrink-0 transition-colors
                    ${isSelected
                                            ? 'border-indigo-600 bg-indigo-600'
                                            : 'border-border group-hover:border-indigo-300'
                                        }
                  `}
                                    aria-hidden="true"
                                >
                                    {isSelected && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                            <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg leading-none" aria-hidden="true">{icon}</span>
                                        <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-900' : 'text-foreground'}`}>
                                            {label}
                                        </span>
                                    </div>
                                    <p className={`text-xs mt-1 ${isSelected ? 'text-indigo-700/70' : 'text-muted-foreground'}`}>
                                        {description}
                                    </p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </fieldset>

            {error && (
                <p role="alert" className="text-sm text-destructive text-center">
                    {error}
                </p>
            )}

            {/* Continue button */}
            <Button
                onClick={handleContinue}
                disabled={!selected || loading}
                className="w-full h-11"
                aria-label={selected ? `Continue as ${selected}` : 'Select a business type to continue'}
            >
                {loading ? 'Saving…' : 'Continue →'}
            </Button>
        </div>
    )
}
