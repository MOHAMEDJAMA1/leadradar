import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh session — required for Server Components
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // --- 1. Global IP Rate Limiting ---
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1'
    const now = Date.now()
    const rateLimitWindow = 60 * 1000 // 1 minute
    const maxRequests = 100 // Slightly higher than 60 to be safe for hydration/assets

    // Simple in-memory rate limit check (Note: resets on instance restart)
    const globalAny = global as any
    if (!globalAny.rateLimitMap) {
        globalAny.rateLimitMap = new Map()
    }
    
    const clientData = globalAny.rateLimitMap.get(ip) || { count: 0, startTime: now }
    
    if (now - clientData.startTime > rateLimitWindow) {
        clientData.count = 1
        clientData.startTime = now
    } else {
        clientData.count++
    }
    
    globalAny.rateLimitMap.set(ip, clientData)
    
    if (clientData.count > maxRequests) {
        console.error(`[SECURITY] Global rate limit exceeded for IP: ${ip}`)
        return new NextResponse('Too Many Requests', { status: 429 })
    }

    // --- 2. Auth & Route Protection ---
    const { pathname } = request.nextUrl

    // Unauthenticated users can only access auth routes and the landing page
    const isAuthRoute =
        pathname.startsWith('/login') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/auth')

    const isPublicRoute = 
        pathname === '/' || 
        pathname === '/terms' || 
        pathname === '/privacy' || 
        pathname === '/refund'

    // Allow cron jobs to bypass user session check (they have their own CRON_SECRET auth)
    const isCronRoute = pathname.startsWith('/api/cron')

    if (!user && !isAuthRoute && !isPublicRoute && !isCronRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Authenticated users should not reach auth pages
    if (user && isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
