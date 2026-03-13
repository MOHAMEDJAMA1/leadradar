'use client'

import type { ReactNode } from 'react'

// Minimal SVG sparkline from a number array
function Sparkline({ values, color }: { values: number[]; color: string }) {
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min || 1
    const w = 80
    const h = 28
    const pts = values.map((v, i) => {
        const x = (i / (values.length - 1)) * w
        const y = h - ((v - min) / range) * h
        return `${x},${y}`
    })
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true" className="opacity-80">
            <polyline
                points={pts.join(' ')}
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    )
}

interface StatCardProps {
    icon: ReactNode
    iconBg: string
    label: string
    value: string
    delta: string
    deltaType: 'up' | 'down' | 'neutral'
    sparkline?: number[]
    sparkColor?: string
}

export function StatCard({
    icon,
    iconBg,
    label,
    value,
    delta,
    deltaType,
    sparkline,
    sparkColor = '#60a5fa',
}: StatCardProps) {
    const deltaColor =
        deltaType === 'up' ? 'text-emerald-400' :
            deltaType === 'down' ? 'text-red-400' :
                'text-slate-400'

    return (
        <article className="flex flex-col gap-3 p-5 rounded-2xl border border-white/8 bg-[#111827]">
            <div className="flex items-start justify-between">
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${iconBg}`}>
                    {icon}
                </div>
                <span className={`text-xs font-semibold ${deltaColor}`}>
                    {delta}
                </span>
            </div>
            <div>
                <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
                <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
            </div>
            {sparkline && (
                <div className="mt-auto">
                    <Sparkline values={sparkline} color={sparkColor} />
                </div>
            )}
        </article>
    )
}
