'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { SocialAuthButtons } from './SocialAuthButtons'
import { registerAction, INITIAL_ERROR } from '@/lib/auth/actions'

export function RegisterForm() {
  const [showPassword, setShowPassword]    = useState(false)
  const [agreedToTerms, setAgreedToTerms]  = useState(false)
  const [state, formAction, isPending]     = useActionState(registerAction, INITIAL_ERROR)

  return (
    <div className="p-xl md:p-xxl bg-surface-container-lowest/60">
      <RegisterFormHeader />
      <form action={formAction} className="space-y-lg">
        <Input name="fullName"     id="full-name"      label="Full Name"      type="text"  placeholder="John Doe"         icon="person"         size="lg" />
        <Input name="businessName" id="business-name"  label="Business Name"  type="text"  placeholder="Acme Corp"        icon="corporate_fare" size="lg" />
        <Input name="email"        id="register-email" label="Email Address"  type="email" placeholder="john@example.com" icon="mail"           size="lg" />
        <Input
          name="password"
          id="register-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          icon="lock"
          size="lg"
          hint="Minimum 8 characters."
          trailingSlot={
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          }
        />
        <TermsCheckbox checked={agreedToTerms} onChange={setAgreedToTerms} />
        {state.error && (
          <p role="alert" className="label-sm text-error bg-error/10 rounded-lg px-md py-sm">
            {state.error}
          </p>
        )}
        <div className="pt-md space-y-md">
          <Button type="submit" size="lg" className="w-full group" disabled={isPending || !agreedToTerms}>
            {isPending ? 'Creating account…' : 'Create Account'}
            {!isPending && (
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            )}
          </Button>
          <div className="flex items-center justify-center gap-sm">
            <span className="body-md text-text-muted">Already have an account?</span>
            <Link href="/login" className="body-md text-primary font-semibold hover:underline">Log in</Link>
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
      <p className="body-md text-text-muted mt-xs">Create your professional workspace in minutes.</p>
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
        <span className="px-md bg-surface-container-lowest label-sm text-text-muted">Or continue with</span>
      </div>
    </div>
  )
}
