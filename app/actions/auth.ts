'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export type AuthResult = 
    | { success: true; data: any }
    | { success: false; error: string; code?: 'DUPLICATE_EMAIL' | 'AUTH_ERROR' | 'GENERIC_ERROR' }

/**
 * Enhanced signup action that checks for duplicate emails before proceeding.
 */
export async function signUp(formData: { email: string; password: string; origin: string }): Promise<AuthResult> {
    const { email, password, origin } = formData
    
    try {
        // 1. Initial Sanitization
        const sanitizedEmail = email.trim().toLowerCase()
        if (!sanitizedEmail || !password) {
            return { success: false, error: 'Email and password are required', code: 'GENERIC_ERROR' }
        }

        // 2. Pre-signup Duplication Check (Application Layer)
        // We use the Admin Client to check the profiles table across all users
        const adminSupabase = await createAdminClient()
        const { data: existingProfile, error: checkError } = await adminSupabase
            .from('profiles')
            .select('id')
            .eq('email', sanitizedEmail)
            .maybeSingle()

        if (checkError) {
            logger.error('[Auth] Error checking for existing email', checkError)
            // Continue if we can't check, the DB constraint will still catch it
        }

        if (existingProfile) {
            logger.security(`Signup blocked: Duplicate email attempt for ${sanitizedEmail}`)
            return { 
                success: false, 
                error: 'An account with this email already exists. Please log in instead.',
                code: 'DUPLICATE_EMAIL'
            }
        }

        // 3. Trigger Supabase Auth Signup
        const supabase = await createClient()
        const { data, error: signupError } = await supabase.auth.signUp({
            email: sanitizedEmail,
            password,
            options: { 
                emailRedirectTo: `${origin}/auth/callback?next=/onboarding` 
            },
        })

        if (signupError) {
            // Handle Supabase's own duplicate detection if our check missed it (race condition)
            if (signupError.message.includes('already registered') || signupError.status === 422) {
                return { 
                    success: false, 
                    error: 'An account with this email already exists. Please log in instead.',
                    code: 'DUPLICATE_EMAIL'
                }
            }
            logger.error('[Auth] Signup error', signupError)
            return { success: false, error: signupError.message, code: 'AUTH_ERROR' }
        }

        logger.info(`New user signed up: ${sanitizedEmail}`)
        return { success: true, data }

    } catch (err: any) {
        logger.error('[Auth] Unexpected signup error', err)
        return { success: false, error: 'An unexpected error occurred. Please try again.', code: 'GENERIC_ERROR' }
    }
}
