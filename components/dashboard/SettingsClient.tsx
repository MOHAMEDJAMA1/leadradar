'use client'

import { useState } from 'react'
import { Settings, Save, Clock, Mail, AlertCircle } from 'lucide-react'
import { updateUserSettings } from '@/app/actions/settings'

interface UserSettings {
    scan_frequency: string
    email_alerts_enabled: boolean
}

export function SettingsClient({ initialSettings }: { initialSettings: UserSettings }) {
    const [settings, setSettings] = useState<UserSettings>(initialSettings)
    const [isSaving, setIsSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setIsSaving(true)
        setSuccessMessage('')
        setErrorMessage('')

        const result = await updateUserSettings(settings)

        if (result.success) {
            setSuccessMessage('Settings saved successfully.')
            setTimeout(() => setSuccessMessage(''), 3000)
        } else {
            setErrorMessage(result.error || 'Failed to save settings.')
        }

        setIsSaving(false)
    }

    return (
        <div className="max-w-3xl space-y-8">
            <header className="flex flex-col gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <Settings className="w-6 h-6 text-slate-400" />
                    Automation Settings
                </h1>
                <p className="text-slate-400 max-w-xl text-sm md:text-base">
                    Configure how often LeadRadar scans for leads and how you want to be notified.
                </p>
            </header>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-[#111827] rounded-2xl border border-white/8 p-6 md:p-8 space-y-8">

                    {/* Scan Frequency */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-400" />
                                Automated Scan Frequency
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Choose how often LeadRadar should automatically scan your monitored communities.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'manual', label: 'Manual Only', desc: 'No background scanning' },
                                { id: '10m', label: 'Every 10 minutes', desc: 'Ultra-fast monitoring' },
                                { id: '30m', label: 'Every 30 minutes', desc: 'Balanced freshness' },
                                { id: '1h', label: 'Every hour', desc: 'Standard monitoring interval' },
                            ].map((option) => (
                                <label
                                    key={option.id}
                                    className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm transition-all shadow-black/5 ${settings.scan_frequency === option.id
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.04]'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="scan_frequency"
                                        value={option.id}
                                        className="sr-only"
                                        checked={settings.scan_frequency === option.id}
                                        onChange={(e) => setSettings({ ...settings, scan_frequency: e.target.value })}
                                    />
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-sm font-semibold ${settings.scan_frequency === option.id ? 'text-blue-400' : 'text-slate-300'}`}>
                                            {option.label}
                                        </span>
                                        <span className="text-xs text-slate-500">{option.desc}</span>
                                    </div>
                                    {settings.scan_frequency === option.id && (
                                        <div className="absolute top-4 right-4">
                                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shadow-inner">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                            </div>
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/5" />

                    {/* Email Alerts */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Mail className="w-5 h-5 text-emerald-400" />
                                Email Digest (Coming Soon)
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Receive a daily summary of newly discovered leads directly to your inbox.
                            </p>
                        </div>

                        <label className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors">
                            <div className="flex flex-col pr-4">
                                <span className="text-sm font-semibold text-slate-300">Daily Digest Emails</span>
                                <span className="text-xs text-slate-500 mt-1">Send me a rollup of new leads once every 24 hours.</span>
                            </div>
                            <div className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] ${settings.email_alerts_enabled ? 'bg-blue-500' : 'bg-slate-700'}`}>
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={settings.email_alerts_enabled}
                                    onChange={(e) => setSettings({ ...settings, email_alerts_enabled: e.target.checked })}
                                />
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.email_alerts_enabled ? 'translate-x-5' : 'translate-x-0'}`}
                                />
                            </div>
                        </label>
                    </div>

                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>

                    {successMessage && (
                        <span className="text-sm font-semibold text-emerald-400 animate-in fade-in slide-in-from-left-2">
                            {successMessage}
                        </span>
                    )}

                    {errorMessage && (
                        <span className="text-sm font-semibold text-red-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                            <AlertCircle className="w-4 h-4" />
                            {errorMessage}
                        </span>
                    )}
                </div>
            </form>
        </div>
    )
}
