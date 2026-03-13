'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Globe2, Save, ExternalLink } from 'lucide-react'
import { updateMonitoredCommunities, type CommunityState } from '@/app/actions/communities'

interface CommunitiesClientProps {
    communities: CommunityState[]
}

export function CommunitiesClient({ communities: initial }: CommunitiesClientProps) {
    const router = useRouter()
    const [communities, setCommunities] = useState<CommunityState[]>(initial)
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()
    const [hasChanges, setHasChanges] = useState(false)

    const filtered = communities.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.source_name.toLowerCase().includes(search.toLowerCase())
    )

    const monitoredCount = communities.filter(c => c.isMonitored).length

    function handleToggle(id: string) {
        setCommunities(prev => prev.map(c =>
            c.id === id ? { ...c, isMonitored: !c.isMonitored } : c
        ))
        setHasChanges(true)
    }

    function handleSave() {
        startTransition(async () => {
            const monitoredIds = communities.filter(c => c.isMonitored).map(c => c.id)
            const result = await updateMonitoredCommunities(monitoredIds)

            if (result.success) {
                setHasChanges(false)
                router.refresh()
            } else {
                alert(result.error || 'Failed to save')
            }
        })
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-white">Communities</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        <span className="text-white font-medium">{monitoredCount}</span> monitored
                        <span className="mx-1.5 text-slate-700">·</span>
                        {communities.length} total available
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Save className="w-4 h-4" />
                    {isPending ? 'Saving…' : 'Save Changes'}
                </button>
            </header>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search subreddits or platforms…"
                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/8 bg-white/4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((c) => (
                    <article
                        key={c.id}
                        onClick={() => handleToggle(c.id)}
                        className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${c.isMonitored
                            ? 'bg-[#111827] border-blue-500/50 shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50'
                            : 'bg-white/3 border-white/8 hover:bg-white/5 hover:border-white/10'
                            }`}
                        role="checkbox"
                        aria-checked={c.isMonitored}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleToggle(c.id) : null}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                <Globe2 className="w-3.5 h-3.5" />
                                {c.source_name}
                            </div>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${c.isMonitored ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-transparent'}`}>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-2">
                            <h3 className={`text-base font-bold truncate transition-colors ${c.isMonitored ? 'text-white' : 'text-slate-300'}`}>
                                {c.source_name === 'Reddit' ? 'r/' : ''}{c.name}
                            </h3>
                            {c.source_name === 'Reddit' && (
                                <a
                                    href={`https://reddit.com/r/${c.name}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                                    aria-label={`View r/${c.name} on Reddit`}
                                    title="View on Reddit"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm border border-white/5 rounded-2xl bg-white/3">
                    <div className="flex flex-col items-center gap-1.5">
                        <p className="font-semibold text-slate-300">No communities {search ? 'found' : 'monitored'}</p>
                        <p className="text-slate-500">{search ? 'Try a different search term.' : 'Select communities to monitor.'}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
