'use client'

import { useState } from 'react'
import { SocialAuthButtons } from './SocialAuthButtons'

interface RegisterFormState {
  fullName: string
  businessName: string
  email: string
  password: string
  agreedToTerms: boolean
  showPassword: boolean
}

const INITIAL_STATE: RegisterFormState = {
  fullName:      '',
  businessName:  '',
  email:         '',
  password:      '',
  agreedToTerms: false,
  showPassword:  false,
}

interface FieldInputProps {
  id: string
  label: string
  type: React.HTMLInputTypeAttribute
  placeholder: string
  icon: string
  value: string
  onChange: (v: string) => void
  hint?: string
  trailingSlot?: React.ReactNode
}

function FieldInput({ id, label, type, placeholder, icon, value, onChange, hint, trailingSlot }: FieldInputProps) {
  return (
    <div className="space-y-xs">
      <label className="label-md text-text-muted" htmlFor={id}>{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-surface-container h-12 pl-12 pr-4 rounded-lg border border-outline-variant/30 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all"
        />
        {trailingSlot}
      </div>
      {hint && <p className="label-sm text-text-muted opacity-60">{hint}</p>}
    </div>
  )
}

export function RegisterForm() {
  const [form, setForm] = useState<RegisterFormState>(INITIAL_STATE)

  const set = <K extends keyof RegisterFormState>(key: K) =>
    (value: RegisterFormState[K]) => setForm((prev) => ({ ...prev, [key]: value }))

  const togglePasswordVisibility = () => set('showPassword')(!form.showPassword)

  return (
    <div className="p-xl md:p-xxl bg-surface-container-lowest/60">
      <RegisterFormHeader />

      <form className="space-y-lg" onSubmit={(e) => e.preventDefault()}>
        <FieldInput id="full_name"      label="Full Name"       type="text"     placeholder="John Doe"       icon="person"         value={form.fullName}     onChange={set('fullName')} />
        <FieldInput id="business_name"  label="Business Name"   type="text"     placeholder="Acme Corp"      icon="corporate_fare" value={form.businessName} onChange={set('businessName')} />
        <FieldInput id="email"          label="Email Address"   type="email"    placeholder="john@example.com" icon="mail"           value={form.email}        onChange={set('email')} />
        <FieldInput
          id="password"
          label="Password"
          type={form.showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon="lock"
          value={form.password}
          onChange={set('password')}
          hint="Minimum 8 characters with one number."
          trailingSlot={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {form.showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          }
        />

        <TermsCheckbox checked={form.agreedToTerms} onChange={set('agreedToTerms')} />

        <div className="pt-md space-y-md">
          <button
            type="submit"
            className="w-full h-12 bg-primary-container text-secondary-fixed-dim font-bold rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-sm shadow-lg shadow-primary-container/20"
          >
            Create Account
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          <div className="flex items-center justify-center gap-sm">
            <span className="body-md text-text-muted">Already have an account?</span>
            <a href="/login" className="body-md text-primary font-semibold hover:underline">
              Log in
            </a>
          </div>
        </div>
      </form>

      <SocialDivider />
      <SocialAuthButtons />
    </div>
  )
}

function RegisterFormHeader() {
  return (
    <div className="mb-xl">
      <h2 className="headline-lg text-on-surface">Get Started</h2>
      <p className="body-md text-text-muted mt-xs">
        Create your professional workspace in minutes.
      </p>
    </div>
  )
}

interface TermsCheckboxProps {
  checked: boolean
  onChange: (v: boolean) => void
}

function TermsCheckbox({ checked, onChange }: TermsCheckboxProps) {
  return (
    <div className="flex items-start gap-sm pt-xs">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id="terms"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-outline-variant/50 bg-surface-container text-primary-container focus:ring-primary-container"
        />
      </div>
      <label className="label-sm text-on-surface-variant" htmlFor="terms">
        I agree to the{' '}
        <a className="text-primary hover:underline" href="#">Terms of Service</a>
        {' '}and{' '}
        <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
      </label>
    </div>
  )
}

function SocialDivider() {
  return (
    <div className="relative my-xl">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-outline-variant/30" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-md bg-surface-container-lowest label-sm text-text-muted">
          Or continue with
        </span>
      </div>
    </div>
  )
}
