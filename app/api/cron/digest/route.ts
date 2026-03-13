import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization')

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        logger.security('Unauthorized attempt to trigger email digest cron')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('Email digest cron cycle started')

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Find all users with email_alerts_enabled
        const { data: users, error: userError } = await supabase
            .from('user_settings')
            .select('user_id, email_alerts_enabled')
            .eq('email_alerts_enabled', true)

        if (userError) throw userError

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const results = []

        for (const user of users || []) {
            // Find leads created in the last 24h
            const { count: leadCount, error: leadError } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.user_id)
                .gte('created_at', yesterday.toISOString())

            if (leadError) throw leadError

            if (leadCount && leadCount > 0) {
                // Phase 6 Preparation: Here we would trigger Resend / Postmark
                results.push({
                    userId: user.user_id,
                    leadsFoundLast24h: leadCount,
                    action: 'Email dispatch queued (Mock)'
                })
            }
        }

        logger.info(`Email digest cycle completed`, {
            digestsPrepared: results.length
        })

        return NextResponse.json({ success: true, digestsPrepared: results })
    } catch (error: any) {
        logger.error('[Cron Digest Error]', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
