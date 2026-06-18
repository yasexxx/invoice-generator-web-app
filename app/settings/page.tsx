import Link                    from 'next/link'
import { getUserEmail }        from '@/lib/auth/session'
import { DashboardNav }       from '@/components/dashboard/DashboardNav'
import { ProfileSection }     from '@/components/settings/ProfileSection'
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm'

export default async function SettingsPage() {
  const email = await getUserEmail()

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <DashboardNav email={email} />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-lg py-xl">
        <SettingsHeader />
        <div className="grid gap-lg max-w-[680px]">
          <ProfileSection email={email} />
          <SecuritySection email={email} />
        </div>
      </main>
    </div>
  )
}

function SettingsHeader() {
  return (
    <div className="mb-xl flex flex-col gap-xs">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-xs self-start font-medium text-on-surface-variant no-underline transition-colors hover:text-primary"
      >
        <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        Dashboard
      </Link>
      <h1 className="headline-lg text-on-surface">Account Settings</h1>
      <p className="body-md text-on-surface-variant">
        Manage your profile and security preferences.
      </p>
    </div>
  )
}

interface SecuritySectionProps { email: string | null }

function SecuritySection({ email }: SecuritySectionProps) {
  return (
    <div className="glass-card rounded-xl p-lg flex flex-col gap-lg">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-[22px] text-primary">shield</span>
        <h2 className="title-md text-on-surface">Security</h2>
      </div>
      <div className="flex flex-col gap-xs">
        <span className="label-md text-on-surface-variant">Password</span>
        <ChangePasswordForm email={email} />
      </div>
    </div>
  )
}
