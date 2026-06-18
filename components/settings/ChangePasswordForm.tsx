'use client'

import { useActionState }             from 'react'
import { Button }                     from '@/components/ui'
import { sendPasswordResetAction }    from '@/app/settings/actions'
import type { ActionState }           from '@/lib/auth/types'

const INITIAL_STATE: ActionState = { error: null }

export interface ChangePasswordFormProps {
  email: string | null
}

export function ChangePasswordForm({ email }: ChangePasswordFormProps) {
  const [state, dispatch, isPending] = useActionState(sendPasswordResetAction, INITIAL_STATE)

  if (state.submitted) {
    return <ResetEmailSentBanner email={email} />
  }

  return (
    <form action={dispatch} className="flex flex-col gap-md">
      <input type="hidden" name="email" value={email ?? ''} />
      <p className="body-md text-on-surface-variant">
        We will send a secure link to your email address. Follow the link to set a new password.
      </p>
      {state.error && <ErrorBanner message={state.error} />}
      <div>
        <Button type="submit" variant="secondary" disabled={isPending}>
          <span className="material-symbols-outlined text-[18px]">
            {isPending ? 'hourglass_empty' : 'lock_reset'}
          </span>
          {isPending ? 'Sending…' : 'Send password reset email'}
        </Button>
      </div>
    </form>
  )
}

interface ResetEmailSentBannerProps { email: string | null }

function ResetEmailSentBanner({ email }: ResetEmailSentBannerProps) {
  return (
    <div className="flex items-start gap-sm rounded-lg bg-success/10 border border-success/20 p-md">
      <span className="material-symbols-outlined text-[20px] text-success shrink-0 mt-xs">
        mark_email_read
      </span>
      <div>
        <p className="label-md text-success">Reset email sent</p>
        <p className="body-md text-on-surface-variant mt-xs">
          Check {email ?? 'your inbox'} for a password reset link.
        </p>
      </div>
    </div>
  )
}

interface ErrorBannerProps { message: string }

function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <p role="alert" className="label-sm text-error bg-error/10 rounded-lg px-md py-sm">
      {message}
    </p>
  )
}
