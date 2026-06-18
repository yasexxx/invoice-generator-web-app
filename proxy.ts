import { NextRequest, NextResponse } from 'next/server'

const AUTH_TOKEN_COOKIE       = 'auth_token'
const DASHBOARD_PATH          = '/dashboard'
const LOGIN_PATH              = '/login'
const AUTH_PAGE_PREFIXES      = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'] as const
const PROTECTED_PATH_PREFIXES = ['/dashboard', '/invoice'] as const

function isAuthPage(pathname: string): boolean {
  return AUTH_PAGE_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname }    = request.nextUrl
  const isAuthenticated = request.cookies.has(AUTH_TOKEN_COOKIE)

  if (isAuthenticated && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
  }

  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
