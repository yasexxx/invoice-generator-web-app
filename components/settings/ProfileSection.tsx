import { Badge } from '@/components/ui'

export interface ProfileSectionProps {
  email: string | null
}

export function ProfileSection({ email }: ProfileSectionProps) {
  return (
    <div className="glass-card rounded-xl p-lg flex flex-col gap-lg">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-[22px] text-primary">person</span>
        <h2 className="title-md text-on-surface">Profile</h2>
      </div>
      <div className="grid gap-md">
        <Field label="Email address">
          <div className="flex items-center gap-sm flex-wrap">
            <span className="body-md text-on-surface">{email ?? '—'}</span>
            <Badge status="success">Verified</Badge>
          </div>
        </Field>
        <Field label="Account type">
          <span className="body-md text-on-surface">Standard</span>
        </Field>
      </div>
    </div>
  )
}

interface FieldProps {
  label:    string
  children: React.ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-xs">
      <span className="label-md text-on-surface-variant">{label}</span>
      {children}
    </div>
  )
}
