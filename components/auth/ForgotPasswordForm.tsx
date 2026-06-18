'use client'

import { useActionState } from 'react'
import { Button, Input } from '@/components/ui'
import { forgotPasswordAction, INITIAL_ERROR } from '@/lib/auth/actions'

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, INITIAL_ERROR)

  if (state.submitted) {
    return <SuccessPanel />
  }

  return (
    <form action={formAction} className="glass-card rounded-xl p-lg md:p-xl shadow-xl flex flex-col gap-lg">
      <ForgotPasswordHeader />
      <Input
        name="email"
        id="forgot-email"
        label="Email address"
        type="email"
        placeholder="name@company.com"
        icon="mail"
        size="lg"
      />
      {state.error && (
        <p role="alert" className="label-sm text-error bg-error/10 rounded-lg px-md py-sm">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? 'Sending…' : 'Send Reset Link'}
      </Button>
      <a href="/login" className="label-sm text-primary text-center hover:underline">
        Back to login
      </a>
    </form>
  )
}

function ForgotPasswordHeader() {
  return (
    <div className="space-y-sm">
      <h2 className="title-md text-on-surface">Forgot your password?</h2>
      <p className="body-md text-on-surface-variant">
        Enter your email and we&apos;ll send you a reset link if an account exists.
      </p>
    </div>
  )
}

function SuccessPanel() {
  return (
    <div className="glass-card rounded-xl p-lg md:p-xl shadow-xl flex flex-col gap-lg text-center">
      <span className="material-symbols-outlined text-[48px] text-primary mx-auto">mark_email_read</span>
      <div className="space-y-sm">
        <h2 className="title-md text-on-surface">Check your inbox</h2>
        <p className="body-md text-on-surface-variant">
          If an account exists for that email, you&apos;ll receive a reset link within a few minutes.
        </p>
      </div>
      <a href="/login" className="label-sm text-primary hover:underline">
        Back to login
      </a>
    </div>
  )
}
