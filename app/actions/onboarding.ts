'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function saveBusinessType(businessType: string) {
    const supabase = await createClient()

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/login')
    }

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            email: user.email,
            business_type: businessType,
            onboarding_completed: true,
        })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}
