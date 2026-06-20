'use client'

import { useActionState, useState } from 'react'
import Link                          from 'next/link'
import { Button, Input }             from '@/components/ui'
import { SocialAuthButtons } from './SocialAuthButtons'
import { loginAction }    from '@/lib/auth/actions'
import { INITIAL_ERROR } from '@/lib/auth/types'

const REMEMBER_ME_DAYS = 30

export function LoginForm() {
  const [remember,      setRemember]      = useState(false)
  const [showPassword,  setShowPassword]  = useState(false)
  const [state, formAction, isPending]    = useActionState(loginAction, INITIAL_ERROR)

  return (
    <form action={formAction} className="glass-card rounded-xl p-lg md:p-xl shadow-xl flex flex-col gap-lg">
      <LoginCardHeader />
      <div className="flex flex-col gap-md">
        <Input
          name="email"
          id="login-email"
          label="Email address"
          type="email"
          placeholder="name@company.com"
          icon="mail"
          size="lg"
        />
        <PasswordFieldRow showPassword={showPassword} onToggle={() => setShowPassword(p => !p)} />
      </div>
      {state.error && <ErrorBanner message={state.error} />}
      <RememberCheckbox checked={remember} onChange={setRemember} />
      <SubmitButton isPending={isPending} />
      <SocialDivider />
      <SocialAuthButtons />
    </form>
  )
}

function LoginCardHeader() {
  return (
    <div className="space-y-sm">
      <h2 className="title-md text-on-surface">Welcome back</h2>
      <p className="body-md text-on-surface-variant">
        Enter your credentials to manage your invoices.
      </p>
    </div>
  )
}

interface PasswordFieldRowProps {
  showPassword: boolean
  onToggle:     () => void
}

function PasswordFieldRow({ showPassword, onToggle }: PasswordFieldRowProps) {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex justify-between items-center">
        <label className="label-md text-text-muted" htmlFor="login-password">Password</label>
        <Link href="/forgot-password" className="label-sm text-primary hover:text-secondary transition-colors">
          Forgot password?
        </Link>
      </div>
      <Input
        name="password"
        id="login-password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        icon="lock"
        size="lg"
        trailingSlot={<TogglePasswordButton show={showPassword} onToggle={onToggle} />}
      />
    </div>
  )
}

interface TogglePasswordButtonProps {
  show:     boolean
  onToggle: () => void
}

function TogglePasswordButton({ show, onToggle }: TogglePasswordButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-on-surface-variant hover:text-primary transition-colors"
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      <span className="material-symbols-outlined text-[20px]">
        {show ? 'visibility_off' : 'visibility'}
      </span>
    </button>
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

interface RememberCheckboxProps {
  checked:  boolean
  onChange: (v: boolean) => void
}

function RememberCheckbox({ checked, onChange }: RememberCheckboxProps) {
  return (
    <label className="flex items-center gap-sm cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded bg-surface-container-low border-outline-variant/30 text-primary focus:ring-primary/20 cursor-pointer"
      />
      <span className="body-md text-on-surface-variant">Remember me for {REMEMBER_ME_DAYS} days</span>
    </label>
  )
}

interface SubmitButtonProps { isPending: boolean }

function SubmitButton({ isPending }: SubmitButtonProps) {
  return (
    <Button type="submit" size="lg" className="w-full group" disabled={isPending}>
      <span>{isPending ? 'Logging in…' : 'Log In'}</span>
      {!isPending && (
        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      )}
    </Button>
  )
}

function SocialDivider() {
  return (
    <div className="flex items-center gap-md">
      <div className="h-px flex-1 bg-outline-variant/20" />
      <span className="label-sm text-text-muted uppercase tracking-widest">or continue with</span>
      <div className="h-px flex-1 bg-outline-variant/20" />
    </div>
  )
}
