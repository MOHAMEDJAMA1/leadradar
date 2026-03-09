import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { ExampleLeadStrip } from '@/components/landing/ExampleLeadStrip'
import { ProductPreview } from '@/components/landing/ProductPreview'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { AudienceSection } from '@/components/landing/AudienceSection'
import { IntentFeatureSection } from '@/components/landing/IntentFeatureSection'
import { HotLeadSection } from '@/components/landing/HotLeadSection'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { StatsSection } from '@/components/landing/StatsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'LeadRadar — Find People Already Asking for Your Service Online',
    description:
        'LeadRadar scans online communities and detects high-intent posts where people are looking for services like yours. AI-powered lead detection for agencies and consultants.',
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#050810] text-white overflow-x-hidden">
            <Navbar />
            <main>
                <HeroSection />
                <ExampleLeadStrip />
                <ProductPreview />
                <HowItWorks />
                <AudienceSection />
                <IntentFeatureSection />
                <HotLeadSection />
                <FeaturesGrid />
                <StatsSection />
                <PricingSection />
                <FinalCTA />
            </main>
            <Footer />
        </div>
    )
}
