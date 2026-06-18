'use server'

import { forgotPasswordApi } from '@/lib/auth/authApi'
import type { ActionState }  from '@/lib/auth/types'

export async function sendPasswordResetAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get('email')
  if (typeof email !== 'string' || !email) {
    return { error: 'Invalid session. Please log in again.' }
  }

  try {
    await forgotPasswordApi(email)
  } catch {
    return { error: 'Could not send reset email. Please try again.' }
  }

  return { error: null, submitted: true }
}
