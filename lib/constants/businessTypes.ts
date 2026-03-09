export const BUSINESS_TYPES = [
    {
        id: 'marketing_agency',
        label: 'Marketing Agency',
        description: 'Full-service or digital marketing agencies',
        icon: '📣',
    },
    {
        id: 'seo_consultant',
        label: 'SEO Consultant',
        description: 'Search engine optimization specialists',
        icon: '🔍',
    },
    {
        id: 'ppc_agency',
        label: 'PPC Agency',
        description: 'Paid search and paid social specialists',
        icon: '🎯',
    },
    {
        id: 'web_development_agency',
        label: 'Web Development Agency',
        description: 'Web design and development studios',
        icon: '💻',
    },
    {
        id: 'shopify_agency',
        label: 'Shopify Agency',
        description: 'Shopify store builders and consultants',
        icon: '🛍️',
    },
    {
        id: 'other',
        label: 'Other',
        description: 'Another type of service business',
        icon: '✨',
    },
] as const

export type BusinessTypeId = (typeof BUSINESS_TYPES)[number]['id']
