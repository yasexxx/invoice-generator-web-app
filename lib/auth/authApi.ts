const AUTH_API_BASE = process.env.AUTH_API_URL ?? 'http://localhost:8081'

export interface AuthTokens {
  accessToken:     string
  rawRefreshToken: string
}

async function extractApiError(response: Response): Promise<string> {
  try {
    const body = await response.json() as { detail?: string }
    return body.detail ?? 'An unexpected error occurred'
  } catch {
    return 'An unexpected error occurred'
  }
}

function parseCookieValue(setCookieHeader: string, name: string): string {
  const prefix = `${name}=`
  for (const segment of setCookieHeader.split(';')) {
    const trimmed = segment.trim()
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length)
    }
  }
  return ''
}

function extractRefreshToken(response: Response): string {
  const raw = response.headers.get('set-cookie') ?? ''
  return parseCookieValue(raw, 'rt')
}

export async function loginApi(email: string, password: string): Promise<AuthTokens> {
  const response = await fetch(`${AUTH_API_BASE}/api/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(await extractApiError(response))
  }

  const data = await response.json() as { accessToken: string }
  return { accessToken: data.accessToken, rawRefreshToken: extractRefreshToken(response) }
}

export async function registerApi(email: string, password: string): Promise<void> {
  const response = await fetch(`${AUTH_API_BASE}/api/auth/register`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(await extractApiError(response))
  }
}

export async function forgotPasswordApi(email: string): Promise<void> {
  await fetch(`${AUTH_API_BASE}/api/auth/forgot-password`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email }),
  })
  // always succeeds — Java never reveals whether the email exists
}

export async function resetPasswordApi(token: string, newPassword: string): Promise<void> {
  const response = await fetch(`${AUTH_API_BASE}/api/auth/reset-password`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ token, newPassword }),
  })

  if (!response.ok) {
    throw new Error(await extractApiError(response))
  }
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await fetch(`${AUTH_API_BASE}/api/auth/logout`, {
    method:  'POST',
    headers: { Cookie: `rt=${refreshToken}` },
  }).catch(() => { /* best-effort: clear local session regardless */ })
}

export async function verifyEmailApi(token: string): Promise<void> {
  const url = new URL(`${AUTH_API_BASE}/api/auth/verify-email`)
  url.searchParams.set('token', token)
  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(await extractApiError(response))
  }
}

export async function refreshApi(refreshToken: string): Promise<AuthTokens> {
  const response = await fetch(`${AUTH_API_BASE}/api/auth/refresh`, {
    method:  'POST',
    headers: { Cookie: `rt=${refreshToken}` },
  })

  if (!response.ok) {
    throw new Error(await extractApiError(response))
  }

  const data = await response.json() as { accessToken: string }
  return { accessToken: data.accessToken, rawRefreshToken: extractRefreshToken(response) }
}
