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

const HIGH_INTENT_RULES: ScoringRule[] = [
    // Phase 7.5: High Intent Phrases
    { patterns: ['looking for', 'need help with', 'recommend someone', 'agency needed', 'freelancer needed', 'developer needed', 'marketing help', 'seo help', 'hiring'], points: 5, label: 'High-Intent Phrase Detected' },
    { patterns: ['seeking', 'hire', 'looking to hire', 'need someone', 'want to hire'], points: 5, label: 'Hiring signal detected' },
    { patterns: ['recommend', 'recommendation', 'suggest', 'suggestion'], points: 4, label: 'Contains "recommend"' },
    { patterns: ['help me', 'please help', 'help needed'], points: 3, label: 'Contains "help me"' },
    { patterns: ['can someone', 'anyone know', 'does anyone', 'has anyone'], points: 3, label: 'Contains "can someone"' },
    { patterns: ['where can i find', 'where can i get', 'how do i find'], points: 3, label: 'Contains "where can I find"' },
    { patterns: ['we need', 'our company needs', 'my business needs'], points: 4, label: 'Detected business need' },
    { patterns: ['agency', 'consultant', 'freelancer', 'expert', 'specialist', 'professional'], points: 2, label: 'Detected service term' },
]

const MEDIUM_INTENT_RULES: ScoringRule[] = [
    { patterns: ['best tool', 'best software', 'best agency', 'best platform'], points: 3, label: 'Contains "best [X]"' },
    { patterns: ['alternative to', 'alternatives to', 'vs ', ' versus '], points: 2, label: 'Contains comparison language' },
    { patterns: ['what should i use', 'what do you use', 'what are you using'], points: 3, label: 'Contains "what should I use"' },
    { patterns: ['anyone used', 'anyone tried', 'anyone recommend'], points: 3, label: 'Contains peer recommendation request' },
    { patterns: ['which is better', 'what is better', 'pros and cons'], points: 2, label: 'Contains evaluation language' },
]

const BOOST_RULES: ScoringRule[] = [
    { patterns: ['budget', '$', 'per month', '/month', 'per year', '/year', 'rate', 'paying', 'compensation', 'pay', 'contract', 'pricing'], points: 3, label: 'budget_signal_detected' },
    { patterns: ['asap', 'urgent', 'urgently', 'immediately', 'as soon as possible'], points: 2, label: 'Urgency detected' },
    { patterns: ['deadline', 'by next week', 'by end of'], points: 2, label: 'Timeline mentioned' },
    { patterns: ['paid', 'pay well', 'competitive rate', 'good pay'], points: 2, label: 'Payment mentioned' },
]

const NEGATIVE_RULES: ScoringRule[] = [
    // Phase 7.5: Weak Signal Penalty (-4)
    { patterns: ['thoughts on', 'what do you think', 'experiences with', 'opinions on', 'lessons learned', 'story'], points: -4, label: 'discussion_signal_detected' },
    // Phase 7.5: Broad Question Penalty (-3)
    { patterns: ['what tools do you use', 'best crm', 'how do you handle'], points: -3, label: 'Broad question penalty' },
    
    { patterns: ['my story', 'my experience', 'case study', 'lessons', 'journey'], points: -5, label: 'story_signal_detected' },
    { patterns: ['my product', 'i built', 'i created', 'i made', 'launching my', 'check out my', 'introducing my'], points: -5, label: 'Self-promotion detected' },
    { patterns: ['promo code', 'discount code', 'affiliate link', 'use my link'], points: -4, label: 'Promotional content' },
    { patterns: ['in my experience', 'my opinion', 'i think that', 'i believe that'], points: -2, label: 'Opinion/discussion (not a request)' },
    { patterns: ['suggestions', 'advice', 'tips', 'thoughts', 'opinions'], points: -3, label: 'Advice/Discussion detected' },
    { patterns: ['rant', 'venting', 'frustrated with', 'disappointed with'], points: -3, label: 'Complaint without request' },
]

// ─── Thresholds ───────────────────────────────────────────────────────────────

export const SCORE_THRESHOLDS = {
    high: 10,
    medium: 5,
    minimum: 1, // lowered from 4 to catch any keyword match that isn't heavily penalized
}

// ─── Scorer ───────────────────────────────────────────────────────────────────

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
 * Phase 7.5: Proximity Checker
 * Verifies if an intent phrase appears within exactly `distance` words of the matched keyword.
 */
function hasCloseProximity(text: string, phrase: string, keyword: string, maxWords: number = 5): boolean {
    const textLower = text.toLowerCase()
    const pLower = phrase.toLowerCase()
    const kLower = keyword.toLowerCase()

    const pIndex = textLower.indexOf(pLower)
    const kIndex = textLower.indexOf(kLower)

    if (pIndex === -1 || kIndex === -1) return false

    // Quick distance string slice counting spaces
    const start = Math.min(pIndex + pLower.length, kIndex + kLower.length)
    const end = Math.max(pIndex, kIndex)
    
    // If the words are physically overlapping/adjacent, it's valid
    if (start >= end) return true

    const substringBetween = textLower.slice(start, end)
    const wordsBetween = substringBetween.split(/\s+/).filter(w => w.trim().length > 0).length

    return wordsBetween <= maxWords
}

/**
 * Score the intent of a post based on its normalized searchText.
 * Returns a numeric score, level (high/medium/low), human-readable reasons, and lead_confidence.
 */
export function scoreIntent(
    searchText: string, 
    matchedKeyword: string, 
    platform: 'reddit' | 'twitter' = 'reddit',
    createdAt?: string
): IntentScore & { lead_confidence: 'Hot' | 'High' | 'Medium' | 'Low' } {
    const reasons: string[] = []
    let totalScore = 0

    reasons.push(`Matched keyword "${matchedKeyword}"`)

    const high = applyRules(searchText, HIGH_INTENT_RULES)
    const medium = applyRules(searchText, MEDIUM_INTENT_RULES)
    const boost = applyRules(searchText, BOOST_RULES)
    const negative = applyRules(searchText, NEGATIVE_RULES)

    totalScore += high.points + medium.points + boost.points + negative.points
    
    // Base points for just matching a keyword
    totalScore += 2 
    reasons.push('Base match: Keyword detected')

    reasons.push(...high.reasons, ...medium.reasons, ...boost.reasons)

    if (negative.points < 0) {
        reasons.push(...negative.reasons)
    }

    // Phase 7.5: Keyword Proximity Overdrive
    let hasProximityMatch = false
    if (high.points > 0) {
        const intentPhrases = HIGH_INTENT_RULES.flatMap(r => r.patterns)
        for (const phrase of intentPhrases) {
            if (searchText.includes(phrase) && hasCloseProximity(searchText, phrase, matchedKeyword, 5)) {
                totalScore += 5 // Huge proximity boost
                hasProximityMatch = true
                reasons.push('Proximity: Keyword near intent phrase')
                break
            }
        }
    }

    // Phase 7.5: Recency Priority
    if (createdAt) {
        const postTime = new Date(createdAt).getTime()
        const now = Date.now()
        const ageHours = (now - postTime) / (1000 * 60 * 60)
        
        if (ageHours < 1) {
            totalScore += 2
            reasons.push('Recency: < 1hr old')
        } else if (ageHours < 6) {
            totalScore += 1
            reasons.push('Recency: < 6hr old')
        } else if (ageHours > 48) {
            totalScore -= 2
            reasons.push('Age penalty: > 48hr old')
        }
    }

    // Phase 7.5: Platform Context Adjustment
    if (platform === 'reddit' && negative.points < 0) {
        // Reddit is noisy, penalize discussions slightly more
        totalScore -= 1 
    } else if (platform === 'twitter' && hasProximityMatch) {
        // Twitter is short and punchy, trust proximity heavy
        totalScore += 2
    }

    // Clamp score for IntentScore interface 0-100
    const normalizedScore = Math.max(0, Math.min(100, Math.floor((totalScore / 15) * 100)))

    const level: 'high' | 'medium' | 'low' =
        totalScore >= SCORE_THRESHOLDS.high ? 'high' :
        totalScore >= SCORE_THRESHOLDS.medium ? 'medium' :
        'low'

    // Phase 7.5: Calculate Final Confidence Label
    let confidence: 'Hot' | 'High' | 'Medium' | 'Low' = 'Low'
    if (totalScore >= 12 && hasProximityMatch && negative.points === 0) {
        confidence = 'Hot'
    } else if (totalScore >= 8) {
        confidence = 'High'
    } else if (totalScore >= 4) {
        confidence = 'Medium'
    }

    return { 
        score: normalizedScore, 
        level, 
        reasons: [...new Set(reasons)],
        lead_confidence: confidence 
    }
}

export function meetsThreshold(rawScore: number): boolean {
    return rawScore >= SCORE_THRESHOLDS.minimum
}

// Export raw score calculator for use in scanner
export function getRawScore(searchText: string): number {
    const high = applyRules(searchText, HIGH_INTENT_RULES)
    const medium = applyRules(searchText, MEDIUM_INTENT_RULES)
    const boost = applyRules(searchText, BOOST_RULES)
    const negative = applyRules(searchText, NEGATIVE_RULES)
    // Include base boost in raw score too
    return high.points + medium.points + boost.points + negative.points + 2
}
