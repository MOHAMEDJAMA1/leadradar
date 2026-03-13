import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

/**
 * Memoized version of getUser.
 * This ensures we only call the Supabase auth API once per request,
 * even if multiple server components or actions need the user.
 */
export const getAuthenticatedUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})
