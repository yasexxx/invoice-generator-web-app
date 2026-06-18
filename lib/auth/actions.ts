'use server'

import { redirect } from 'next/navigation'
import {
  forgotPasswordApi,
  loginApi,
  logoutApi,
  registerApi,
  resetPasswordApi,
} from './authApi'
import { clearAuthCookies, getRefreshToken, setAuthCookies } from './cookies'
import type { ActionState } from './types'

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email    = typeof formData.get('email')    === 'string' ? (formData.get('email')    as string) : ''
  const password = typeof formData.get('password') === 'string' ? (formData.get('password') as string) : ''

  try {
    const { accessToken, rawRefreshToken } = await loginApi(email, password)
    await setAuthCookies(accessToken, rawRefreshToken)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Login failed. Please try again.' }
  }

  redirect('/dashboard')
}

export async function registerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email    = typeof formData.get('email')    === 'string' ? (formData.get('email')    as string) : ''
  const password = typeof formData.get('password') === 'string' ? (formData.get('password') as string) : ''

  try {
    await registerApi(email, password)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Registration failed. Please try again.' }
  }

  redirect('/verify-email')
}

export async function logoutAction(): Promise<void> {
  const refreshToken = await getRefreshToken()
  if (refreshToken) {
    await logoutApi(refreshToken)
  }
  await clearAuthCookies()
  redirect('/login')
}

export async function forgotPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = typeof formData.get('email') === 'string' ? (formData.get('email') as string) : ''

  try {
    await forgotPasswordApi(email)
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }

  return { error: null, submitted: true }
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token       = typeof formData.get('token')       === 'string' ? (formData.get('token')       as string) : ''
  const newPassword = typeof formData.get('newPassword') === 'string' ? (formData.get('newPassword') as string) : ''

  try {
    await resetPasswordApi(token, newPassword)
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Password reset failed. Please try again.' }
  }

  redirect('/login')
}

