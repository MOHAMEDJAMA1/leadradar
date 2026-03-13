'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── Types ──────────────────────────────────────────────────────────────────

export type Keyword = {
    id: string
    keyword: string
    category: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}

export type KeywordResult =
    | { success: true; data?: Keyword }
    | { success: false; error: string }

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthedUser() {
    const supabase = await createClient()
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()
    if (error || !user) redirect('/login')
    return { supabase, user }
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getKeywords(): Promise<Keyword[]> {
    const { supabase, user } = await getAuthedUser()
    const { data } = await supabase
        .from('tracked_keywords')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    return data ?? []
}

export async function createKeyword(
    phrase: string,
    category: string
): Promise<KeywordResult> {
    const { supabase, user } = await getAuthedUser()
    const { data, error } = await supabase
        .from('tracked_keywords')
        .insert({ user_id: user.id, keyword: phrase.trim(), category: category.trim() || null })
        .select()
        .single()
    if (error) return { success: false, error: error.message }
    revalidatePath('/keywords')
    revalidatePath('/dashboard')
    return { success: true, data }
}

export async function bulkCreateKeywords(
    items: { phrase: string; category: string }[]
): Promise<KeywordResult> {
    const { supabase, user } = await getAuthedUser()
    const rows = items
        .filter((i) => i.phrase.trim())
        .map((i) => ({
            user_id: user.id,
            keyword: i.phrase.trim().toLowerCase(),
            category: i.category.trim() || null,
            is_active: true,
        }))
    if (rows.length === 0) return { success: true }
    const { error } = await supabase
        .from('tracked_keywords')
        .upsert(rows, { onConflict: 'user_id,keyword', ignoreDuplicates: true })
    if (error) return { success: false, error: error.message }
    revalidatePath('/keywords')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateKeyword(
    id: string,
    patch: { keyword?: string; category?: string }
): Promise<KeywordResult> {
    const { supabase, user } = await getAuthedUser()
    const { data, error } = await supabase
        .from('tracked_keywords')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
    if (error) return { success: false, error: error.message }
    revalidatePath('/keywords')
    return { success: true, data }
}

export async function deleteKeyword(id: string): Promise<KeywordResult> {
    const { supabase, user } = await getAuthedUser()
    const { error } = await supabase
        .from('tracked_keywords')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/keywords')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function toggleKeyword(
    id: string,
    isActive: boolean
): Promise<KeywordResult> {
    const { supabase, user } = await getAuthedUser()
    const { data, error } = await supabase
        .from('tracked_keywords')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
    if (error) return { success: false, error: error.message }
    revalidatePath('/keywords')
    revalidatePath('/dashboard')
    return { success: true, data }
}
