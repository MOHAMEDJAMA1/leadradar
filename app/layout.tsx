import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
    variable: '--font-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: {
        default: 'LeadRadar — Find High-Intent Leads from Online Communities',
        template: '%s | LeadRadar',
    },
    description:
        'LeadRadar helps agencies and service businesses discover high-intent buying signals from online communities like Reddit. Find people already asking for your service.',
    keywords: ['lead generation', 'B2B leads', 'Reddit leads', 'buying signals', 'agency growth'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    )
}
