'use server'

import { createClient } from '@/lib/supabase/server'

export type WaitlistResult =
    | { success: true }
    | { success: false; error: string }

export async function joinWaitlist(
    email: string,
    serviceType: string
): Promise<WaitlistResult> {
    if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' }
    }

    const supabase = await createClient()

    const { error } = await supabase.from('waitlist').insert({
        email: email.trim().toLowerCase(),
        service_type: serviceType.trim() || null,
    })

    if (error) {
        // Unique constraint means already on list
        if (error.code === '23505') {
            return { success: true } // Treat as success — they're already on it
        }
        return { success: false, error: 'Something went wrong. Please try again.' }
    }

    return { success: true }
}
