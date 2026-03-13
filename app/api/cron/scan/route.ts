import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { runScan } from '@/lib/services/reddit/scanner'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization')

    // Check for standard Vercel CRON Auth or our own custom secret
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        logger.security('Unauthorized attempt to trigger automated scan cron')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('Automated scan cron cycle started')

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role to bypass RLS for cron
        )

        // Find all users who have scanning enabled
        const { data: users, error: userError } = await supabase
            .from('user_settings')
            .select('user_id, scan_frequency')

        if (userError) throw userError

        const results = []
        let totalLeads = 0

        for (const user of users || []) {
            if (user.scan_frequency !== 'manual') {
                // Run the scan. createAlerts = true
                const summary = await runScan(supabase, user.user_id, true)
                const leadsDetected = (summary.reddit?.leadsDetected || 0) + (summary.twitter?.leadsDetected || 0)
                totalLeads += leadsDetected
                results.push({ userId: user.user_id, summary })
            }
        }

        logger.info(`Automated scan cycle completed successfully`, {
            usersScanned: results.length,
            totalLeadsDetected: totalLeads
        })

        return NextResponse.json({ success: true, results })
    } catch (error: any) {
        logger.error('[Cron Scan Error]', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
