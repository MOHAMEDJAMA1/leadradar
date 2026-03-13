import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Setup Your Radar — LeadRadar',
}

export default function OnboardingPage() {
    return <OnboardingWizard />
}
