'use server'

import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { headers } from 'next/headers'

export type WaitlistResult =
    | { success: true }
    | { success: false; error: string }

export async function joinWaitlist(
    email: string,
    serviceType: string
): Promise<WaitlistResult> {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'

    if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' }
    }

    logger.info(`Waitlist join attempt: ${email} (IP: ${ip})`)

    const supabase = await createClient()

    const { error } = await supabase.from('waitlist').insert({
        email: email.trim().toLowerCase(),
        service_type: serviceType.trim() || null,
    })

    if (error) {
        // Unique constraint means already on list
        if (error.code === '23505') {
            logger.info(`Waitlist: Email ${email} already registered.`)
            return { success: true } // Treat as success — they're already on it
        }
        logger.error(`Waitlist join error for ${email}`, error)
        return { success: false, error: 'Something went wrong. Please try again.' }
    }

    logger.info(`Waitlist: ${email} joined successfully.`)
    return { success: true }
}
