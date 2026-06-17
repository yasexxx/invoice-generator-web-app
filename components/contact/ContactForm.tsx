'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

type SubmitState = 'idle' | 'submitting' | 'success'

const SUBJECTS = [
  'Billing inquiry',
  'Technical issue',
  'Feature request',
  'Account help',
  'General question',
] as const

const INPUT_CLASS =
  'w-full bg-surface-container-low border border-outline-variant/30 rounded-lg py-md px-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all body-md'

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitState('submitting')
    setTimeout(() => setSubmitState('success'), 1200)
  }

  if (submitState === 'success') {
    return <SuccessState />
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-lg md:p-xl border border-outline-variant/20 flex flex-col gap-lg">
      <FormHeader />
      <div className="grid sm:grid-cols-2 gap-md">
        <FieldWrapper label="Your name">
          <input
            id="contact-name"
            type="text"
            placeholder="Alex Johnson"
            required
            value={form.name}
            onChange={handleChange('name')}
            className={INPUT_CLASS}
          />
        </FieldWrapper>
        <FieldWrapper label="Email address">
          <input
            id="contact-email"
            type="email"
            placeholder="alex@company.com"
            required
            value={form.email}
            onChange={handleChange('email')}
            className={INPUT_CLASS}
          />
        </FieldWrapper>
      </div>
      <FieldWrapper label="Subject">
        <select
          id="contact-subject"
          required
          value={form.subject}
          onChange={handleChange('subject')}
          className={INPUT_CLASS}
        >
          <option value="" disabled>Select a topic…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </FieldWrapper>
      <FieldWrapper label="Message">
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell us how we can help…"
          required
          value={form.message}
          onChange={handleChange('message')}
          className={`${INPUT_CLASS} resize-none`}
        />
      </FieldWrapper>
      <Button type="submit" disabled={submitState === 'submitting'} className="self-start">
        {submitState === 'submitting' ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}

function FormHeader() {
  return (
    <div>
      <h2 className="title-md text-on-surface mb-xs">Send us a message</h2>
      <p className="body-md text-text-muted">We&apos;ll reply within one business day.</p>
    </div>
  )
}

interface FieldWrapperProps {
  label: string
  children: React.ReactNode
}

function FieldWrapper({ label, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-xs">
      <label className="label-md text-text-muted">{label}</label>
      {children}
    </div>
  )
}

function SuccessState() {
  return (
    <div className="glass-card rounded-xl p-xl border border-outline-variant/20 flex flex-col items-center text-center gap-md">
      <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-[32px] leading-none">check_circle</span>
      </div>
      <div>
        <h2 className="title-md text-on-surface mb-xs">Message sent!</h2>
        <p className="body-md text-text-muted">We&apos;ll be in touch within one business day.</p>
      </div>
    </div>
  )
}
