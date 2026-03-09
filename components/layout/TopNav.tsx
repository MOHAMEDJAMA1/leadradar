import { createClient } from '@/lib/supabase/server'
import { Bell } from 'lucide-react'

interface TopNavProps {
    title?: string
}

export async function TopNav({ title = 'Dashboard' }: TopNavProps) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const initials = user?.email
        ? user.email.slice(0, 2).toUpperCase()
        : 'LR'

    return (
        <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
            <div>
                <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications placeholder */}
                <button
                    className="relative flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="w-4.5 h-4.5" aria-hidden="true" />
                </button>

                {/* User avatar */}
                <div
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-sm"
                    aria-label={`Signed in as ${user?.email ?? 'user'}`}
                    title={user?.email ?? ''}
                >
                    {initials}
                </div>
            </div>
        </header>
    )
}
