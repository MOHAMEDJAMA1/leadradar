'use client'

import { useState } from 'react'
import { WaitlistModal } from '@/components/landing/WaitlistModal'

interface WaitlistButtonProps {
    children: React.ReactNode
    className?: string
}

export function WaitlistButton({ children, className = '' }: WaitlistButtonProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={className}
            >
                {children}
            </button>
            <WaitlistModal isOpen={open} onClose={() => setOpen(false)} />
        </>
    )
}
