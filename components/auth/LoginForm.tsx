'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { SocialAuthButtons } from './SocialAuthButtons'

export function LoginForm() {
  const [remember, setRemember] = useState(false)

  return (
    <div className="glass-card rounded-xl p-lg md:p-xl shadow-xl flex flex-col gap-lg">
      <LoginCardHeader />
      <LoginFields />
      <RememberCheckbox checked={remember} onChange={setRemember} />
      <SubmitButton />
      <SocialDivider />
      <SocialAuthButtons />
    </div>
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

function LoginFields() {
  return (
    <div className="flex flex-col gap-md">
      <Input
        id="login-email"
        label="Email address"
        type="email"
        placeholder="name@company.com"
        icon="mail"
        size="lg"
      />
      <PasswordFieldRow />
    </div>
  )
}

function PasswordFieldRow() {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex justify-between items-center">
        <label className="label-md text-text-muted" htmlFor="login-password">Password</label>
        <a href="#" className="label-sm text-primary hover:text-secondary transition-colors">
          Forgot password?
        </a>
      </div>
      <Input
        id="login-password"
        type="password"
        placeholder="••••••••"
        icon="lock"
        size="lg"
      />
    </div>
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
      <span className="body-md text-on-surface-variant">Remember me for 30 days</span>
    </label>
  )
}

function SubmitButton() {
  return (
    <Button type="submit" size="lg" className="w-full group">
      <span>Log In</span>
      <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
        arrow_forward
      </span>
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
