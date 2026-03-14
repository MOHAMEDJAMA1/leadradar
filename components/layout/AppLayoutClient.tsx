'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'

interface AppLayoutClientProps {
    children: React.ReactNode
    userName: string
    lastScanAt?: string | null
}

export function AppLayoutClient({ children, userName, lastScanAt }: AppLayoutClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div className={`relative flex flex-col h-screen overflow-hidden lg:pl-[220px] transition-all duration-300`}>
                <TopNav 
                    userName={userName} 
                    lastScanAt={lastScanAt}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
                    {children}
                </main>
            </div>
            
            {/* Mobile backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 animate-in fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    )
}
