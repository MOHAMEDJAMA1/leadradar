import { createAdminClient } from '@/lib/supabase/server'

export type LogLevel = 'info' | 'warn' | 'error' | 'security'

interface LogEntry {
    level: LogLevel
    endpoint: string
    message: string
    user_id?: string
    ip?: string
    metadata?: any
}

/**
 * Centralized logger for LeadRadar.
 * In a real production environment, this would also send logs to
 * a service like Axiom, Datadog, or Sentry.
 */
export async function logEvent({ level, endpoint, message, user_id, ip, metadata }: LogEntry) {
    const timestamp = new Date().toISOString()
    
    // Console log for immediate visibility in Vercel/Terminal logs
    const logPrefix = `[${timestamp}] [${level.toUpperCase()}] [${endpoint}]`
    const logMessage = `${logPrefix} ${message} ${user_id ? `(User: ${user_id})` : ''}`
    
    if (level === 'error' || level === 'security') {
        console.error(logMessage, metadata || '')
    } else {
        console.log(logMessage, metadata || '')
    }

    // Optional: Persist security/error logs to Supabase for audit trail
    if (level === 'security' || level === 'error') {
        try {
            const supabase = await createAdminClient()
            await supabase.from('security_logs').insert({
                level,
                endpoint,
                message,
                user_id,
                ip,
                metadata,
                created_at: timestamp
            })
        } catch (err) {
            console.error('Failed to persist security log:', err)
        }
    }
}

/**
 * Convenience wrapper for logging.
 */
export const logger = {
    info: (message: string, metadata?: any) => logEvent({ level: 'info', endpoint: 'system', message, metadata }),
    warn: (message: string, metadata?: any) => logEvent({ level: 'warn', endpoint: 'system', message, metadata }),
    error: (message: string, error?: any) => logEvent({ level: 'error', endpoint: 'system', message, metadata: error }),
    security: (message: string, metadata?: any) => logEvent({ level: 'security', endpoint: 'security', message, metadata })
}
