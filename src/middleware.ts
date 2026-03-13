import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login and auth callback through
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
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
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in → redirect to login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if this user is approved
  const { data: allowed } = await supabase
    .from('allowed_users')
    .select('approved')
    .eq('email', user.email)
    .maybeSingle()

  if (!allowed?.approved) {
    // Not approved — sign out and block
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login?error=access_denied', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
