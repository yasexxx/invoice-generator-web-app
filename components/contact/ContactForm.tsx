'use client'

import { useState } from 'react'
import { Button, Input, Textarea } from '@/components/ui'

type FormState = {
  name:    string
  email:   string
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
        <Input
          label="Your name"
          type="text"
          placeholder="Alex Johnson"
          required
          value={form.name}
          onChange={handleChange('name')}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="alex@company.com"
          required
          value={form.email}
          onChange={handleChange('email')}
        />
      </div>
      <SubjectSelect value={form.subject} onChange={handleChange('subject')} />
      <Textarea
        label="Message"
        rows={5}
        placeholder="Tell us how we can help…"
        required
        resize="none"
        value={form.message}
        onChange={handleChange('message')}
      />
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

interface SubjectSelectProps {
  value:    string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

function SubjectSelect({ value, onChange }: SubjectSelectProps) {
  return (
    <div className="flex flex-col gap-xs">
      <label className="label-md text-text-muted" htmlFor="contact-subject">Subject</label>
      <select
        id="contact-subject"
        required
        value={value}
        onChange={onChange}
        className="w-full bg-surface-container border border-outline-variant/40 rounded-lg py-[10px] px-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/25 transition-all body-md"
      >
        <option value="" disabled>Select a topic…</option>
        {SUBJECTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
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
