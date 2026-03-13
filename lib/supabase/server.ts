import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('⚠️ Supabase environment variables are missing. Returning dummy client for build phase.')
        return createServerClient('https://placeholder.supabase.co', 'placeholder', {
            cookies: {
                getAll: () => [],
                setAll: () => { },
            },
        })
    }

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing user sessions.
                    }
                },
            },
        }
    )
}

/**
 * Creates a Supabase client with the service role key.
 * Use this ONLY for administrative tasks on the server that bypass RLS.
 */
export async function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase Admin environment variables')
    }

    return createServerClient(supabaseUrl, serviceRoleKey, {
        cookies: {
            getAll() {
                return []
            },
            setAll() {
                // No-op for admin client
            },
        },
    })
}
