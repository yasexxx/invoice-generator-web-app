import { NextRequest, NextResponse } from 'next/server'

const AUTH_API_BASE        = process.env.AUTH_API_URL ?? 'http://localhost:8081'
const AUTH_TOKEN_COOKIE    = 'auth_token'
const AUTH_REFRESH_COOKIE  = 'auth_refresh'
const AUTH_TOKEN_MAX_AGE   = 900        // 15 minutes
const AUTH_REFRESH_MAX_AGE = 2_592_000  // 30 days
const DASHBOARD_PATH       = '/dashboard'
const LOGIN_PATH           = '/login'

const AUTH_PAGE_PREFIXES      = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'] as const
const PROTECTED_PATH_PREFIXES = ['/dashboard', '/invoice'] as const

const COOKIE_BASE = { httpOnly: true, secure: true, sameSite: 'strict' as const, path: '/' }

function isAuthPage(pathname: string): boolean {
  return AUTH_PAGE_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

function parseCookieValue(setCookieHeader: string, name: string): string {
  const prefix = `${name}=`
  for (const segment of setCookieHeader.split(';')) {
    const trimmed = segment.trim()
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length)
  }
  return ''
}

interface RefreshedTokens { accessToken: string; rawRefreshToken: string }

async function tryRefresh(rawRefreshToken: string): Promise<RefreshedTokens | null> {
  try {
    const response = await fetch(`${AUTH_API_BASE}/api/auth/refresh`, {
      method:  'POST',
      headers: { Cookie: `rt=${rawRefreshToken}` },
    })
    if (!response.ok) return null

    const data           = await response.json() as { accessToken: string }
    const setCookieHeader = response.headers.get('set-cookie') ?? ''
    const newRefreshToken = parseCookieValue(setCookieHeader, 'rt')
    if (!newRefreshToken) return null

    return { accessToken: data.accessToken, rawRefreshToken: newRefreshToken }
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname }    = request.nextUrl
  const hasAccessToken  = request.cookies.has(AUTH_TOKEN_COOKIE)
  const hasRefreshToken = request.cookies.has(AUTH_REFRESH_COOKIE)

  if (hasAccessToken && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
  }

  if (isProtectedRoute(pathname)) {
    if (hasAccessToken) return NextResponse.next()

    const rawRefreshToken = request.cookies.get(AUTH_REFRESH_COOKIE)?.value
    if (hasRefreshToken && rawRefreshToken) {
      const tokens = await tryRefresh(rawRefreshToken)
      if (tokens) {
        const response = NextResponse.redirect(request.url)
        response.cookies.set(AUTH_TOKEN_COOKIE,   tokens.accessToken,     { ...COOKIE_BASE, maxAge: AUTH_TOKEN_MAX_AGE })
        response.cookies.set(AUTH_REFRESH_COOKIE, tokens.rawRefreshToken, { ...COOKIE_BASE, maxAge: AUTH_REFRESH_MAX_AGE })
        return response
      }
      const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url))
      response.cookies.delete(AUTH_REFRESH_COOKIE)
      return response
    }

    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
