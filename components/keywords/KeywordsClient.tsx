'use client'

import { useState, useTransition, useMemo } from 'react'
import { Search, Plus, Pencil, Trash2, Check, X, Tag } from 'lucide-react'
import type { Keyword } from '@/app/actions/keywords'
import {
    createKeyword,
    updateKeyword,
    deleteKeyword,
    toggleKeyword,
} from '@/app/actions/keywords'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
    'Service Request',
    'Hiring',
    'Recommendation',
    'Paid Search',
    'Paid Social',
    'Technical',
    'Custom',
]

const INTENT_COLORS: Record<string, string> = {
    'Service Request': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    'Hiring': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    'Recommendation': 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    'Paid Search': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    'Paid Social': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
    'Technical': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    'Custom': 'bg-slate-500/15 text-slate-400 border-slate-500/20',
}

function CategoryBadge({ category }: { category: string | null }) {
    const label = category ?? 'Custom'
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${INTENT_COLORS[label] ?? INTENT_COLORS['Custom']}`}>
            <Tag className="w-2.5 h-2.5" />
            {label}
        </span>
    )
}

interface KeywordModalProps {
    initial?: { phrase: string; category: string }
    onSave: (phrase: string, category: string) => Promise<void>
    onClose: () => void
    isPending: boolean
}

function KeywordModal({ initial, onSave, onClose, isPending }: KeywordModalProps) {
    const [phrase, setPhrase] = useState(initial?.phrase ?? '')
    const [category, setCategory] = useState(initial?.category ?? 'Service Request')

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl p-6">
                <h2 className="text-base font-semibold text-white mb-5">
                    {initial ? 'Edit keyword' : 'Add keyword'}
                </h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="kw-phrase" className="block text-xs font-medium text-slate-400 mb-1.5">
                            Keyword phrase <span className="text-blue-400">*</span>
                        </label>
                        <input
                            id="kw-phrase"
                            type="text"
                            value={phrase}
                            onChange={(e) => setPhrase(e.target.value)}
                            placeholder="e.g. looking for marketing agency"
                            className="w-full h-10 px-3 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        />
                    </div>
                    <div>
                        <label htmlFor="kw-category" className="block text-xs font-medium text-slate-400 mb-1.5">
                            Category
                        </label>
                        <select
                            id="kw-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border border-white/10 bg-[#0d1117] text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        >
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2 mt-6">
                    <button onClick={onClose} className="flex-1 h-10 rounded-lg text-sm font-medium text-slate-400 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(phrase, category)}
                        disabled={isPending || !phrase.trim()}
                        className="flex-1 h-10 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isPending ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}

interface KeywordsClientProps {
    initialKeywords: Keyword[]
}

export function KeywordsClient({ initialKeywords }: KeywordsClientProps) {
    const router = useRouter()
    const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState<'add' | { kw: Keyword } | null>(null)
    const [isPending, startTransition] = useTransition()
    const [togglingId, setTogglingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const filtered = useMemo(() =>
        keywords.filter((k) =>
            k.keyword.toLowerCase().includes(search.toLowerCase()) ||
            (k.category ?? '').toLowerCase().includes(search.toLowerCase())
        ), [keywords, search])

    const activeCount = keywords.filter((k) => k.is_active).length
    const totalCount = keywords.length

    function refresh() { router.refresh() }

    async function handleCreate(phrase: string, category: string) {
        startTransition(async () => {
            const result = await createKeyword(phrase, category)
            if (result.success && result.data) {
                setKeywords((prev) => [result.data!, ...prev])
            }
            setModal(null)
            refresh()
        })
    }

    async function handleUpdate(id: string, phrase: string, category: string) {
        startTransition(async () => {
            const result = await updateKeyword(id, { keyword: phrase, category })
            if (result.success && result.data) {
                setKeywords((prev) => prev.map((k) => k.id === id ? result.data! : k))
            }
            setModal(null)
            refresh()
        })
    }

    async function handleToggle(kw: Keyword) {
        setTogglingId(kw.id)
        const result = await toggleKeyword(kw.id, !kw.is_active)
        if (result.success) {
            setKeywords((prev) => prev.map((k) => k.id === kw.id ? { ...k, is_active: !k.is_active } : k))
        }
        setTogglingId(null)
        refresh()
    }

    async function handleDelete(id: string) {
        setDeletingId(id)
        const result = await deleteKeyword(id)
        if (result.success) {
            setKeywords((prev) => prev.filter((k) => k.id !== id))
        }
        setDeletingId(null)
        refresh()
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Keywords</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            <span className="text-white font-medium">{activeCount}</span> active
                            <span className="mx-1.5 text-slate-700">·</span>
                            {totalCount} total
                        </p>
                    </div>
                    <button
                        onClick={() => setModal('add')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Keyword
                    </button>
                </header>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" aria-hidden="true" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search keywords or categories…"
                        className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/8 bg-white/4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                </div>

                {/* Keyword table */}
                <div className="rounded-xl border border-white/8 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/3">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Keyword</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-500 text-sm">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <p className="font-semibold text-slate-300">No keywords {search ? 'found' : 'configured'}</p>
                                            <p className="text-slate-500">{search ? 'Try a different search term.' : 'Add keywords so LeadRadar knows what opportunities to detect.'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {filtered.map((kw) => (
                                <tr key={kw.id} className="hover:bg-white/2 transition-colors">
                                    <td className="py-3.5 px-4 font-medium text-white">
                                        {kw.keyword}
                                    </td>
                                    <td className="py-3.5 px-4 hidden sm:table-cell">
                                        <CategoryBadge category={kw.category} />
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <button
                                            onClick={() => handleToggle(kw)}
                                            disabled={togglingId === kw.id}
                                            aria-label={kw.is_active ? 'Deactivate keyword' : 'Activate keyword'}
                                            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${kw.is_active ? 'bg-blue-600' : 'bg-white/10'} disabled:opacity-50`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${kw.is_active ? 'translate-x-4' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => setModal({ kw })}
                                                aria-label={`Edit "${kw.keyword}"`}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(kw.id)}
                                                disabled={deletingId === kw.id}
                                                aria-label={`Delete "${kw.keyword}"`}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Stats footer */}
                {totalCount > 0 && (
                    <p className="text-xs text-slate-600 text-center">
                        Showing {filtered.length} of {totalCount} keywords
                        {activeCount < totalCount && ` · ${totalCount - activeCount} paused`}
                    </p>
                )}
            </div>

            {/* Add modal */}
            {modal === 'add' && (
                <KeywordModal
                    onSave={handleCreate}
                    onClose={() => setModal(null)}
                    isPending={isPending}
                />
            )}

            {/* Edit modal */}
            {modal && typeof modal === 'object' && 'kw' in modal && (
                <KeywordModal
                    initial={{ phrase: modal.kw.keyword, category: modal.kw.category ?? 'Custom' }}
                    onSave={(phrase, category) => handleUpdate(modal.kw.id, phrase, category)}
                    onClose={() => setModal(null)}
                    isPending={isPending}
                />
            )}
        </>
    )
}
