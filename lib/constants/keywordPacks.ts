import type { BusinessTypeId } from '@/lib/constants/businessTypes'

export interface KeywordPackItem {
    phrase: string
    category: string
}

export const KEYWORD_PACKS: Record<BusinessTypeId, KeywordPackItem[]> = {
    marketing_agency: [
        { phrase: 'looking for marketing agency', category: 'Service Request' },
        { phrase: 'need marketing help', category: 'Service Request' },
        { phrase: 'facebook ads expert', category: 'Paid Social' },
        { phrase: 'google ads agency', category: 'Paid Search' },
        { phrase: 'hire marketing consultant', category: 'Hiring' },
        { phrase: 'recommend marketing agency', category: 'Recommendation' },
        { phrase: 'digital marketing agency', category: 'Service Request' },
    ],
    seo_consultant: [
        { phrase: 'need seo help', category: 'Service Request' },
        { phrase: 'seo expert', category: 'Service Request' },
        { phrase: 'seo consultant', category: 'Service Request' },
        { phrase: 'technical seo help', category: 'Technical' },
        { phrase: 'recommend seo agency', category: 'Recommendation' },
        { phrase: 'website ranking help', category: 'Service Request' },
        { phrase: 'google ranking consultant', category: 'Service Request' },
    ],
    ppc_agency: [
        { phrase: 'google ads expert', category: 'Paid Search' },
        { phrase: 'facebook ads help', category: 'Paid Social' },
        { phrase: 'ppc consultant', category: 'Service Request' },
        { phrase: 'ad campaign help', category: 'Service Request' },
        { phrase: 'hire ads agency', category: 'Hiring' },
        { phrase: 'paid advertising agency', category: 'Service Request' },
        { phrase: 'tiktok ads expert', category: 'Paid Social' },
    ],
    web_development_agency: [
        { phrase: 'need web developer', category: 'Service Request' },
        { phrase: 'looking for web agency', category: 'Service Request' },
        { phrase: 'website redesign', category: 'Service Request' },
        { phrase: 'hire developer', category: 'Hiring' },
        { phrase: 'web design help', category: 'Service Request' },
        { phrase: 'build website agency', category: 'Service Request' },
        { phrase: 'next js developer', category: 'Technical' },
    ],
    shopify_agency: [
        { phrase: 'shopify expert', category: 'Service Request' },
        { phrase: 'shopify store help', category: 'Service Request' },
        { phrase: 'ecommerce agency', category: 'Service Request' },
        { phrase: 'shopify developer', category: 'Hiring' },
        { phrase: 'build shopify store', category: 'Service Request' },
        { phrase: 'shopify plus agency', category: 'Service Request' },
        { phrase: 'custom shopify theme', category: 'Technical' },
    ],
    other: [
        { phrase: 'need consultant', category: 'Service Request' },
        { phrase: 'looking for agency', category: 'Service Request' },
        { phrase: 'recommend service provider', category: 'Recommendation' },
        { phrase: 'hire freelancer', category: 'Hiring' },
        { phrase: 'need help with', category: 'Service Request' },
        { phrase: 'looking for expert', category: 'Service Request' },
    ],
}
