import { cookies } from 'next/headers'

const AUTH_TOKEN_COOKIE    = 'auth_token'
const AUTH_REFRESH_COOKIE  = 'auth_refresh'
const AUTH_TOKEN_MAX_AGE   = 900        // 15 minutes — matches Java JWT expiry
const AUTH_REFRESH_MAX_AGE = 2_592_000  // 30 days — matches Java refresh token expiry

const COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure:   true,
  sameSite: 'strict',
  path:     '/',
} as const

export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
  const jar = await cookies()
  jar.set(AUTH_TOKEN_COOKIE,   accessToken,   { ...COOKIE_BASE_OPTIONS, maxAge: AUTH_TOKEN_MAX_AGE })
  jar.set(AUTH_REFRESH_COOKIE, refreshToken,  { ...COOKIE_BASE_OPTIONS, maxAge: AUTH_REFRESH_MAX_AGE })
}

export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies()
  jar.delete(AUTH_TOKEN_COOKIE)
  jar.delete(AUTH_REFRESH_COOKIE)
}

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(AUTH_TOKEN_COOKIE)?.value
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(AUTH_REFRESH_COOKIE)?.value
}
