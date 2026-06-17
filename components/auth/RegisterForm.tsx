'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { SocialAuthButtons } from './SocialAuthButtons'

interface RegisterFormState {
  fullName:      string
  businessName:  string
  email:         string
  password:      string
  agreedToTerms: boolean
  showPassword:  boolean
}

const INITIAL_STATE: RegisterFormState = {
  fullName:      '',
  businessName:  '',
  email:         '',
  password:      '',
  agreedToTerms: false,
  showPassword:  false,
}

export function RegisterForm() {
  const [form, setForm] = useState<RegisterFormState>(INITIAL_STATE)

  const set = <K extends keyof RegisterFormState>(key: K) =>
    (value: RegisterFormState[K]) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="p-xl md:p-xxl bg-surface-container-lowest/60">
      <RegisterFormHeader />
      <form className="space-y-lg" onSubmit={(e) => e.preventDefault()}>
        <Input id="full-name"      label="Full Name"      type="text"  placeholder="John Doe"         icon="person"         size="lg" value={form.fullName}     onChange={(e) => set('fullName')(e.target.value)} />
        <Input id="business-name"  label="Business Name"  type="text"  placeholder="Acme Corp"        icon="corporate_fare" size="lg" value={form.businessName} onChange={(e) => set('businessName')(e.target.value)} />
        <Input id="register-email" label="Email Address"  type="email" placeholder="john@example.com" icon="mail"           size="lg" value={form.email}        onChange={(e) => set('email')(e.target.value)} />
        <Input
          id="register-password"
          label="Password"
          type={form.showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon="lock"
          size="lg"
          hint="Minimum 8 characters with one number."
          value={form.password}
          onChange={(e) => set('password')(e.target.value)}
          trailingSlot={
            <button
              type="button"
              onClick={() => set('showPassword')(!form.showPassword)}
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label={form.showPassword ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {form.showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          }
        />
        <TermsCheckbox checked={form.agreedToTerms} onChange={set('agreedToTerms')} />
        <div className="pt-md space-y-md">
          <Button type="submit" size="lg" className="w-full group">
            Create Account
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Button>
          <div className="flex items-center justify-center gap-sm">
            <span className="body-md text-text-muted">Already have an account?</span>
            <Link href="/login" className="body-md text-primary font-semibold hover:underline">
              Log in
            </Link>
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
  checked:  boolean
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
        <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
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
