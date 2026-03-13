'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding, type KeywordPack } from '@/app/actions/onboarding'
import { Rocket, Check, ArrowRight, Sparkles, Building2, Megaphone, Code, Settings, PenTool, Globe, X } from 'lucide-react'

// Pre-defined service types and their default keywords
const SERVICE_TYPES = [
    { id: 'seo', label: 'SEO', icon: Globe, description: 'Search Engine Optimization services' },
    { id: 'marketing', label: 'Marketing Agency', icon: Megaphone, description: 'General marketing & advertising' },
    { id: 'webdev', label: 'Web Development', icon: Code, description: 'Building apps and websites' },
    { id: 'automation', label: 'Automation', icon: Settings, description: 'Workflow & AI automation' },
    { id: 'design', label: 'Design', icon: PenTool, description: 'UI/UX and Graphic Design' },
    { id: 'other', label: 'Other B2B Services', icon: Building2, description: 'Consulting, Fractional CXO, etc.' },
]

const KEYWORD_PACKS: Record<string, KeywordPack[]> = {
    seo: [
        { keyword: 'seo help', category: 'SEO' },
        { keyword: 'need seo', category: 'SEO' },
        { keyword: 'seo consultant', category: 'SEO' },
        { keyword: 'seo agency', category: 'SEO' },
    ],
    marketing: [
        { keyword: 'marketing agency', category: 'Marketing' },
        { keyword: 'need marketing help', category: 'Marketing' },
        { keyword: 'ads help', category: 'Marketing' },
        { keyword: 'marketing consultant', category: 'Marketing' },
    ],
    webdev: [
        { keyword: 'website developer', category: 'Development' },
        { keyword: 'web developer needed', category: 'Development' },
        { keyword: 'need help building website', category: 'Development' },
    ],
    automation: [
        { keyword: 'zapier help', category: 'Automation' },
        { keyword: 'automate workflow', category: 'Automation' },
        { keyword: 'need custom integration', category: 'Automation' },
    ],
    design: [
        { keyword: 'need a designer', category: 'Design' },
        { keyword: 'ui ux designer', category: 'Design' },
        { keyword: 'logo design help', category: 'Design' },
    ],
    other: [
        { keyword: 'need some advice', category: 'General' },
        { keyword: 'looking for consultant', category: 'General' },
    ]
}

const DEFAULT_COMMUNITIES = ['startups', 'smallbusiness', 'entrepreneur', 'SaaS', 'marketing']

export function OnboardingWizard() {
    const router = useRouter()
    
    const [step, setStep] = useState(1)
    const [serviceType, setServiceType] = useState<string>('')
    const [keywords, setKeywords] = useState<KeywordPack[]>([])
    const [communities, setCommunities] = useState<string[]>(DEFAULT_COMMUNITIES)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Edit keyword state
    const [newKeyword, setNewKeyword] = useState('')

    const handleServiceSelect = (id: string) => {
        setServiceType(id)
        setKeywords(KEYWORD_PACKS[id] || KEYWORD_PACKS['other'])
        setStep(2)
    }

    const removeKeyword = (kw: string) => {
        setKeywords(prev => prev.filter(k => k.keyword !== kw))
    }

    const addKeyword = () => {
        if (!newKeyword.trim()) return
        const exists = keywords.some(k => k.keyword.toLowerCase() === newKeyword.trim().toLowerCase())
        if (!exists) {
            setKeywords(prev => [...prev, { keyword: newKeyword.trim(), category: serviceType || 'General' }])
        }
        setNewKeyword('')
    }

    const toggleCommunity = (comm: string) => {
        setCommunities(prev => 
            prev.includes(comm) 
                ? prev.filter(c => c !== comm)
                : [...prev, comm]
        )
    }

    const handleFinish = async () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        
        const result = await completeOnboarding({
            keywords,
            communities
        })
        
        if (result.success) {
            // Hard push to dashboard so it completely re-evaluates server layouts
            window.location.href = '/dashboard'
        } else {
            console.error(result.error)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
            {/* Background embellishments */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
            
            <div className="w-full max-w-2xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col min-h-[500px]">
                
                {/* Progress Header */}
                <div className="flex items-center gap-2 p-6 border-b border-white/5 shrink-0">
                    {[1, 2, 3, 4].map(num => (
                        <div key={num} className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ${step >= num ? 'bg-blue-500' : ''}`}
                                style={{ width: step >= num ? '100%' : '0%' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 sm:p-12 pb-24 overflow-y-auto">
                    
                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-3xl font-black text-white mb-2">What service do you offer?</h2>
                            <p className="text-slate-400 mb-8">This helps us craft the perfect intelligent lead-capture filter for your business.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {SERVICE_TYPES.map(type => {
                                    const Icon = type.icon
                                    return (
                                        <button 
                                            key={type.id}
                                            onClick={() => handleServiceSelect(type.id)}
                                            className="flex flex-col items-start gap-3 p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all text-left group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 group-hover:from-blue-500 group-hover:to-purple-500">
                                                <Icon className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-base">{type.label}</p>
                                                <p className="text-xs text-slate-400 mt-1">{type.description}</p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-3xl font-black text-white mb-2">Your Keyword Pack</h2>
                            <p className="text-slate-400 mb-8">We've selected these high-intent phrases based on your service. You can adjust them now or later.</p>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {keywords.map(kw => (
                                    <span key={kw.keyword} className="inline-flex items-center gap-2 pl-3 pr-1 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
                                        {kw.keyword}
                                        <button 
                                            onClick={() => removeKeyword(kw.keyword)}
                                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Add another keyword (e.g. 'hire developer')" 
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                                    className="flex-1 h-11 px-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                                />
                                <button onClick={addKeyword} className="h-11 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors">
                                    Add
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-3xl font-black text-white mb-2">Track Communities</h2>
                            <p className="text-slate-400 mb-8">Where does your target audience hang out? We've pre-selected the best general business subreddits.</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {['startups', 'smallbusiness', 'entrepreneur', 'SaaS', 'marketing', 'agency', 'freelance', 'webdev', 'technology'].map(comm => {
                                    const active = communities.includes(comm)
                                    return (
                                        <button 
                                            key={comm}
                                            onClick={() => toggleCommunity(comm)}
                                            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${
                                                active 
                                                    ? 'bg-blue-500/15 border-blue-500/30 text-white' 
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${active ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                                                {active && <Check className="w-2.5 h-2.5 text-white" />}
                                            </div>
                                            <span className="font-medium text-sm truncate">r/{comm}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* STEP 4 */}
                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-3">You're all set!</h2>
                            <p className="text-slate-400 max-w-md mx-auto mb-8">
                                LeadRadar is configured to monitor <strong>{communities.length} communities</strong> for <strong>{keywords.length} high-intent keywords</strong> simultaneously.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                {step > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#0d1117]/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-between">
                        <button 
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                        >
                            Back
                        </button>

                        {step < 4 ? (
                            <button 
                                onClick={() => setStep(step + 1)}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleFinish}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    'Setting up...'
                                ) : (
                                    <>
                                        <Rocket className="w-4 h-4" />
                                        Run Your First Scan
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
