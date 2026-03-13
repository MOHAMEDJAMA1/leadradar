/**
 * LeadRadar Structured Server Logger
 * Provides consistent formatting for system events, security audits, and error tracking.
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SECURITY'

function log(level: LogLevel, message: string, context?: any) {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
    
    // In production, this goes to stdout for Vercel/CloudWatch/etc.
    const entry = `[${timestamp}] [${level}] ${message}${contextStr}`
    
    if (level === 'ERROR' || level === 'SECURITY') {
        console.error(entry)
    } else {
        console.log(entry)
    }
}

export const logger = {
    info: (msg: string, ctx?: any) => log('INFO', msg, ctx),
    warn: (msg: string, ctx?: any) => log('WARN', msg, ctx),
    error: (msg: string, ctx?: any) => log('ERROR', msg, ctx),
    security: (msg: string, ctx?: any) => log('SECURITY', msg, ctx),
}
