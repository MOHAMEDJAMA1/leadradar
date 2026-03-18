import type { IntentScore } from './types'

// ─── Pre-scoring Exclusions ───────────────────────────────────────────────────

export function isMegathread(title: string): boolean {
    const t = title.toLowerCase()
    return t.includes('weekly') || t.includes('thread') || t.includes('megathread')
}

export function isThread(text: string): boolean {
    const t = text.toLowerCase()
    return (
        t.includes('weekly thread') ||
        t.includes('megathread') ||
        t.includes('jobs thread') ||
        t.includes('discussion thread') ||
        t.includes('promotion thread')
    )
}

// ─── Scoring rules ────────────────────────────────────────────────────────────

interface ScoringRule {
    patterns: string[]
    points: number
    label: string
}

/**
 * Phase 4.7: TIER 1 — Explicit Hire/Buy Intent (Highest signal)
 * These phrases essentially confirm someone wants to pay for a service.
 */
const TIER1_HIRE_RULES: ScoringRule[] = [
    {
        patterns: ['looking for', 'looking to hire', 'looking to work with'],
        points: 8,
        label: 'Hiring signal detected: "looking for"'
    },
    {
        patterns: ['need help with', 'need help on', 'need someone to'],
        points: 8,
        label: 'Hiring signal detected: "need help with"'
    },
    {
        patterns: ['agency needed', 'freelancer needed', 'expert needed', 'developer needed', 'designer needed'],
        points: 9,
        label: 'Explicit hire request detected'
    },
    {
        patterns: ['looking to hire', 'want to hire', 'trying to hire'],
        points: 9,
        label: 'Hiring signal detected: "want to hire"'
    },
    {
        patterns: ['hire', 'hiring'],
        points: 7,
        label: 'Hiring signal detected'
    },
    {
        patterns: ['seeking', 'need someone', 'looking for someone'],
        points: 7,
        label: 'Hiring signal detected: "seeking"'
    },
    {
        patterns: ['recommend', 'recommendations', 'recommend a'],
        points: 6,
        label: 'Recommendation request detected'
    },
]

/**
 * Phase 4.7: TIER 2 — Budget/Payment Signals (Very strong buying intent)
 */
const TIER2_BUDGET_RULES: ScoringRule[] = [
    {
        patterns: ['budget is', 'my budget', 'our budget', 'budget of', 'budget around'],
        points: 9,
        label: 'Budget mentioned explicitly'
    },
    {
        patterns: ['paying', 'will pay', 'can pay', 'ready to pay', 'willing to pay'],
        points: 8,
        label: 'Payment signal detected'
    },
    {
        patterns: ['paid', 'pay well', 'competitive rate', 'good compensation'],
        points: 7,
        label: 'Compensation signal detected'
    },
    {
        patterns: ['$', 'usd', 'per month', '/month', 'per hour', '/hr', '/hour', 'monthly retainer'],
        points: 6,
        label: 'Price/rate mentioned'
    },
    {
        patterns: ['price', 'pricing', 'cost', 'quote', 'proposal'],
        points: 5,
        label: 'Pricing inquiry detected'
    },
    {
        patterns: ['contract', 'retainer', 'project fee', 'fixed rate'],
        points: 5,
        label: 'Contract/retainer signal detected'
    },
]

/**
 * Phase 4.7: TIER 3 — High-Intent Question Phrases
 */
const TIER3_QUESTION_RULES: ScoringRule[] = [
    {
        patterns: ['how do i find', 'where can i find', 'where can i hire', 'where do i find'],
        points: 7,
        label: 'Service-seeking question detected'
    },
    {
        patterns: ['anyone know', 'does anyone know', 'anyone recommend', 'can anyone recommend'],
        points: 6,
        label: 'Peer recommendation request detected'
    },
    {
        patterns: ['we need', 'our company needs', 'my business needs', 'my startup needs'],
        points: 7,
        label: 'Business need detected'
    },
    {
        patterns: ['can someone help', 'help me', 'please help', 'help needed', 'need help'],
        points: 5,
        label: 'Help request detected'
    },
    {
        patterns: ['?'],
        points: 1,
        label: 'Question detected'
    },
]

/**
 * Phase 4.7: TIER 4 — Medium Intent Signals
 */
const TIER4_MEDIUM_RULES: ScoringRule[] = [
    {
        patterns: ['best tool', 'best software', 'best agency', 'best platform', 'best service'],
        points: 3,
        label: 'Searching for best solution'
    },
    {
        patterns: ['alternative to', 'alternatives to', 'vs ', ' versus '],
        points: 2,
        label: 'Comparison/evaluation language'
    },
    {
        patterns: ['what should i use', 'what do you use', 'what are you using'],
        points: 3,
        label: 'Tool evaluation question'
    },
    {
        patterns: ['anyone used', 'anyone tried', 'has anyone used'],
        points: 3,
        label: 'Experience-seeking question'
    },
    {
        patterns: ['agency', 'consultant', 'freelancer', 'expert', 'specialist', 'professional'],
        points: 2,
        label: 'Service-type term detected'
    },
    {
        patterns: ['asap', 'urgent', 'urgently', 'immediately', 'as soon as possible'],
        points: 3,
        label: 'Urgency signal detected'
    },
    {
        patterns: ['deadline', 'by next week', 'by end of month', 'by friday'],
        points: 2,
        label: 'Deadline/timeline mentioned'
    },
]

/**
 * Phase 4.7: STRONG NEGATIVE RULES — Aggressively filter noise
 */
const NEGATIVE_RULES: ScoringRule[] = [
    // Self-promotion / showcasing
    {
        patterns: ['my product', 'i built', 'i created', 'i made', 'launching my', 'check out my', 'introducing my', 'i just launched'],
        points: -10,
        label: 'Self-promotion detected — not a buying signal'
    },
    // Journey / story posts
    {
        patterns: ['my journey', 'my story', 'my experience', 'lessons learned', 'what i learned', 'how i grew'],
        points: -10,
        label: 'Story/Narrative detected — not a buying signal'
    },
    // Discussion / debate posts
    {
        patterns: ['what do you think', 'thoughts on', 'opinions on', 'what are your thoughts', 'discussion'],
        points: -8,
        label: 'Discussion/Opinion post detected'
    },
    // Advice giving (not seeking)
    {
        patterns: ['advice for', 'tips for', 'my advice', 'here is my tip', 'pro tip'],
        points: -6,
        label: 'Advice-giving post detected'
    },
    // Feedback requests (not buying)
    {
        patterns: ['rate my', 'feedback on', 'review my', 'critique my', 'what do you think of my'],
        points: -7,
        label: 'Feedback request detected — not a service inquiry'
    },
    // Generic advice-seeking (low intent)
    {
        patterns: ['advice', 'opinion', 'suggestions', 'tips', 'thoughts'],
        points: -4,
        label: 'Advice/Discussion detected'
    },
    // Rants / venting
    {
        patterns: ['rant', 'venting', 'frustrated with', 'disappointed with', 'sick of', 'tired of'],
        points: -5,
        label: 'Complaint/rant detected — not a buying signal'
    },
    // Promo / spam
    {
        patterns: ['promo code', 'discount code', 'affiliate link', 'use my link', 'referral code'],
        points: -8,
        label: 'Promotional/spam content detected'
    },
    // General opinions
    {
        patterns: ['in my experience', 'my opinion', 'i think that', 'i believe that', 'personally i'],
        points: -3,
        label: 'Personal opinion detected — not a request'
    },
    // Broad questions with no service intent
    {
        patterns: ['what tools do you use', 'how do you handle', 'how do you manage', 'best crm'],
        points: -3,
        label: 'Broad general question — low purchase intent'
    },
]

// ─── Thresholds (Phase 4.7 upgraded) ─────────────────────────────────────────

export const SCORE_THRESHOLDS = {
    hot: 22,      // Must have strong hiring + budget signals
    high: 14,     // Clear intent, strong signals
    medium: 7,    // Some intent signals present
    minimum: 5,   // Minimum to save as lead (raised from 1 for quality)
}

// ─── Applyiing Rules ───────────────────────────────────────────────────────────

function applyRules(text: string, rules: ScoringRule[]): { points: number; reasons: string[] } {
    let points = 0
    const reasons: string[] = []

    for (const rule of rules) {
        for (const pattern of rule.patterns) {
            if (text.includes(pattern)) {
                points += rule.points
                reasons.push(rule.label)
                break // only award each rule once
            }
        }
    }

    return { points, reasons }
}

/**
 * Phase 7.5 + 4.7: Enhanced Proximity Checker
 * Verifies if an intent phrase appears within `maxWords` words of the matched keyword.
 * A tight proximity means "need SEO help" vs just "SEO" in a giant wall of text.
 */
function hasCloseProximity(text: string, phrase: string, keyword: string, maxWords: number = 6): boolean {
    const textLower = text.toLowerCase()
    const pLower = phrase.toLowerCase()
    const kLower = keyword.toLowerCase()

    const pIndex = textLower.indexOf(pLower)
    const kIndex = textLower.indexOf(kLower)

    if (pIndex === -1 || kIndex === -1) return false

    const start = Math.min(pIndex + pLower.length, kIndex + kLower.length)
    const end = Math.max(pIndex, kIndex)

    if (start >= end) return true

    const substringBetween = textLower.slice(start, end)
    const wordsBetween = substringBetween.split(/\s+/).filter(w => w.trim().length > 0).length

    return wordsBetween <= maxWords
}

/**
 * Phase 4.7: Keyword-Intent Context Verification
 * Ensures the keyword isn't just floating in a wall of text but is near a buying signal.
 * "SEO" alone = low context. "looking for SEO help" = strong context.
 */
function getContextualBonus(searchText: string, matchedKeyword: string): { bonus: number; reason: string | null } {
    const allHighIntentPhrases = [
        ...TIER1_HIRE_RULES.flatMap(r => r.patterns),
        ...TIER2_BUDGET_RULES.flatMap(r => r.patterns.slice(0, 3)), // only strong ones
    ]

    for (const phrase of allHighIntentPhrases) {
        if (searchText.includes(phrase) && hasCloseProximity(searchText, phrase, matchedKeyword, 6)) {
            return { bonus: 6, reason: `Context match: "${matchedKeyword}" near "${phrase}"` }
        }
    }

    return { bonus: 0, reason: null }
}

/**
 * Phase 4.7 Main Intent Scorer — Upgraded
 * Scores the intent of a post and returns score, level, reasons, and confidence.
 */
export function scoreIntent(
    searchText: string,
    matchedKeyword: string,
    platform: 'reddit' | 'twitter' = 'reddit',
    createdAt?: string
): IntentScore & { lead_confidence: 'Hot' | 'High' | 'Medium' | 'Low'; confidence_score: number } {
    const reasons: string[] = []
    let totalScore = 0

    reasons.push(`Service keyword matched: ${matchedKeyword}`)

    // Apply all rule tiers
    const tier1 = applyRules(searchText, TIER1_HIRE_RULES)
    const tier2 = applyRules(searchText, TIER2_BUDGET_RULES)
    const tier3 = applyRules(searchText, TIER3_QUESTION_RULES)
    const tier4 = applyRules(searchText, TIER4_MEDIUM_RULES)
    const negative = applyRules(searchText, NEGATIVE_RULES)

    totalScore += tier1.points + tier2.points + tier3.points + tier4.points + negative.points

    // Base points for keyword match
    totalScore += 2
    reasons.push('Base match: Keyword detected in post')

    reasons.push(...tier1.reasons, ...tier2.reasons, ...tier3.reasons, ...tier4.reasons)

    if (negative.points < 0) {
        reasons.push(...negative.reasons)
    }

    // Phase 4.7: Context Bonus — keyword near intent phrase
    const { bonus: contextBonus, reason: contextReason } = getContextualBonus(searchText, matchedKeyword)
    if (contextBonus > 0 && contextReason) {
        totalScore += contextBonus
        reasons.push(contextReason)
    }

    // Recency Priority Boost
    if (createdAt) {
        const ageHours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
        if (ageHours < 1) { totalScore += 2; reasons.push('Recency: < 1hr old') }
        else if (ageHours < 6) { totalScore += 1; reasons.push('Recency: < 6hr old') }
        else if (ageHours > 48) { totalScore -= 2; reasons.push('Age penalty: > 48hr old') }
    }

    // Platform Context Adjustments
    if (platform === 'reddit' && negative.points < 0) {
        totalScore -= 1 // Reddit is noisier
    } else if (platform === 'twitter' && contextBonus > 0) {
        totalScore += 1 // Twitter is punchy, trust context
    }

    // ─── Determine Level ───────────────────────────────────────────────────────
    const level: 'high' | 'medium' | 'low' =
        totalScore >= SCORE_THRESHOLDS.high ? 'high' :
        totalScore >= SCORE_THRESHOLDS.medium ? 'medium' :
        'low'

    // ─── Determine Confidence Label ────────────────────────────────────────────
    // Phase 4.7: HOT requires both strong hiring/buying AND no strong negatives
    const hasHireSignal = tier1.points >= 7
    const hasBudgetSignal = tier2.points >= 5
    const hasNegative = negative.points <= -5

    let confidence: 'Hot' | 'High' | 'Medium' | 'Low' = 'Low'
    if (totalScore >= SCORE_THRESHOLDS.hot && (hasHireSignal || hasBudgetSignal) && !hasNegative) {
        confidence = 'Hot'
    } else if (totalScore >= SCORE_THRESHOLDS.high) {
        confidence = 'High'
    } else if (totalScore >= SCORE_THRESHOLDS.medium) {
        confidence = 'Medium'
    }

    // ─── Confidence Score (0–100) ──────────────────────────────────────────────
    // Normalized against a realistic max of ~35 raw points for a perfect lead
    const MAX_REALISTIC_SCORE = 35
    const confidenceScore = Math.max(0, Math.min(100, Math.round((totalScore / MAX_REALISTIC_SCORE) * 100)))

    // ─── Normalize intent_score_numeric for DB (0–100) ─────────────────────────
    const normalizedScore = Math.max(0, Math.min(100, Math.floor((totalScore / MAX_REALISTIC_SCORE) * 100)))

    return {
        score: normalizedScore,
        level,
        reasons: [...new Set(reasons)],
        lead_confidence: confidence,
        confidence_score: confidenceScore,
    }
}

export function meetsThreshold(rawScore: number): boolean {
    return rawScore >= SCORE_THRESHOLDS.minimum
}

export function getRawScore(searchText: string): number {
    const tier1 = applyRules(searchText, TIER1_HIRE_RULES)
    const tier2 = applyRules(searchText, TIER2_BUDGET_RULES)
    const tier3 = applyRules(searchText, TIER3_QUESTION_RULES)
    const tier4 = applyRules(searchText, TIER4_MEDIUM_RULES)
    const negative = applyRules(searchText, NEGATIVE_RULES)
    return tier1.points + tier2.points + tier3.points + tier4.points + negative.points + 2
}
