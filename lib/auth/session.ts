import { cookies } from 'next/headers'

const AUTH_TOKEN_COOKIE = 'auth_token'
const JWT_PART_COUNT    = 3
const PAYLOAD_INDEX     = 1

export async function getUserEmail(): Promise<string | null> {
  const jar   = await cookies()
  const token = jar.get(AUTH_TOKEN_COOKIE)?.value
  if (!token) return null

  const parts = token.split('.')
  if (parts.length !== JWT_PART_COUNT) return null

  try {
    const payload = Buffer.from(parts[PAYLOAD_INDEX], 'base64url').toString('utf-8')
    const claims  = JSON.parse(payload) as { email?: string }
    return claims.email ?? null
  } catch {
    return null
  }
}
