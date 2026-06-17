'use client'

import { useState } from 'react'
import { SocialAuthButtons } from './SocialAuthButtons'

function SocialDivider() {
  return (
    <div className="flex items-center gap-md">
      <div className="h-px flex-1 bg-outline-variant/20" />
      <span className="label-sm text-text-muted uppercase tracking-widest">or continue with</span>
      <div className="h-px flex-1 bg-outline-variant/20" />
    </div>
  )
}

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
      <IconInput id="email" label="Email address" type="email" placeholder="name@company.com" icon="mail" />
      <PasswordField />
    </div>
  )
}

interface IconInputProps {
  id: string
  label: string
  type: React.HTMLInputTypeAttribute
  placeholder: string
  icon: string
}

function IconInput({ id, label, type, placeholder, icon }: IconInputProps) {
  return (
    <div className="flex flex-col gap-xs">
      <label className="label-md text-text-muted" htmlFor={id}>{label}</label>
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-md pl-xl pr-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all body-md"
        />
      </div>
    </div>
  )
}

function PasswordField() {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex justify-between items-center">
        <label className="label-md text-text-muted" htmlFor="password">Password</label>
        <a className="label-sm text-primary hover:text-secondary transition-colors" href="#">
          Forgot password?
        </a>
      </div>
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
          lock
        </span>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-md pl-xl pr-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all body-md"
        />
      </div>
    </div>
  )
}

interface RememberCheckboxProps {
  checked: boolean
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
    <button
      type="submit"
      className="w-full bg-primary-container text-text-primary font-bold py-md rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm group"
    >
      <span>Log In</span>
      <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
        arrow_forward
      </span>
    </button>
  )
}
