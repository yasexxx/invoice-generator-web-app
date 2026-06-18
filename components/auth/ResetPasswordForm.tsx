'use client'

import { useActionState, useState } from 'react'
import { Button, Input } from '@/components/ui'
import { resetPasswordAction } from '@/lib/auth/actions'
import { INITIAL_ERROR }       from '@/lib/auth/types'

export interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword]    = useState(false)
  const [showConfirm,  setShowConfirm]     = useState(false)
  const [state, formAction, isPending]     = useActionState(resetPasswordAction, INITIAL_ERROR)

  return (
    <form action={formAction} className="glass-card rounded-xl p-lg md:p-xl shadow-xl flex flex-col gap-lg">
      <ResetPasswordHeader />
      <input type="hidden" name="token" value={token} />
      <Input
        name="newPassword"
        id="new-password"
        label="New password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        icon="lock"
        size="lg"
        hint="Minimum 8 characters."
        trailingSlot={<ToggleButton show={showPassword} onToggle={() => setShowPassword(p => !p)} label="new password" />}
      />
      <Input
        name="confirmPassword"
        id="confirm-password"
        label="Confirm new password"
        type={showConfirm ? 'text' : 'password'}
        placeholder="••••••••"
        icon="lock_reset"
        size="lg"
        trailingSlot={<ToggleButton show={showConfirm} onToggle={() => setShowConfirm(p => !p)} label="confirm password" />}
      />
      {state.error && (
        <p role="alert" className="label-sm text-error bg-error/10 rounded-lg px-md py-sm">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? 'Resetting…' : 'Reset Password'}
      </Button>
    </form>
  )
}

function ResetPasswordHeader() {
  return (
    <div className="space-y-sm">
      <h2 className="title-md text-on-surface">Set a new password</h2>
      <p className="body-md text-on-surface-variant">Choose a strong password for your account.</p>
    </div>
  )
}

interface ToggleButtonProps {
  show:     boolean
  onToggle: () => void
  label:    string
}

function ToggleButton({ show, onToggle, label }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-on-surface-variant hover:text-primary transition-colors"
      aria-label={`${show ? 'Hide' : 'Show'} ${label}`}
    >
      <span className="material-symbols-outlined text-[20px]">
        {show ? 'visibility_off' : 'visibility'}
      </span>
    </button>
  )
}
