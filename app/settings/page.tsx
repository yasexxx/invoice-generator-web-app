import { getUserEmail }           from '@/lib/auth/session'
import { BackLink }               from '@/components/ui'
import { DashboardNav }           from '@/components/dashboard/DashboardNav'
import { ProfileSection }         from '@/components/settings/ProfileSection'
import { ChangePasswordForm }     from '@/components/settings/ChangePasswordForm'
import { InvoiceSettingsSection } from '@/components/settings/InvoiceSettingsSection'
import { getInvoiceSettings }     from './invoice-settings-actions'
import { getInvoicePreferences }  from './invoice-preferences-actions'
import type { InvoiceSettingsData } from './invoice-settings-actions'
import type { InvoicePreferences }  from './invoice-preferences-actions'

export interface SettingsPageProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const { tab } = await searchParams
  const activeTab: 'account' | 'invoice' = tab === 'invoice' ? 'invoice' : 'account'
  const email = await getUserEmail()

  let invoiceSettings: InvoiceSettingsData | null = null
  let invoicePreferences: InvoicePreferences | null = null
  if (activeTab === 'invoice') {
    const [settingsResult, preferencesResult] = await Promise.all([
      getInvoiceSettings(),
      getInvoicePreferences(),
    ])
    if (settingsResult.success)     invoiceSettings    = settingsResult.data
    if (preferencesResult.success)  invoicePreferences = preferencesResult.data
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <DashboardNav email={email} />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-lg py-xl">
        <SettingsHeader />
        <SettingsTabs activeTab={activeTab} />
        <div className="max-w-[680px] mt-lg">
          {activeTab === 'account' && <AccountTab email={email} />}
          {activeTab === 'invoice' && (
            <InvoiceSettingsSection
              initialData={invoiceSettings}
              initialPreferences={invoicePreferences}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function SettingsHeader() {
  return (
    <div className="mb-lg flex flex-col gap-xs">
      <BackLink href="/dashboard" label="Dashboard" />
      <h1 className="headline-lg text-on-surface">Settings</h1>
      <p className="body-md text-on-surface-variant">
        Manage your account, security, and invoice preferences.
      </p>
    </div>
  )
}

interface SettingsTabsProps { activeTab: 'account' | 'invoice' }

function SettingsTabs({ activeTab }: SettingsTabsProps) {
  return (
    <div className="flex gap-xs border-b border-outline-variant/20">
      <SettingsTabLink href="/settings?tab=account" label="Account" icon="manage_accounts" active={activeTab === 'account'} />
      <SettingsTabLink href="/settings?tab=invoice" label="Invoice" icon="receipt_long" active={activeTab === 'invoice'} />
    </div>
  )
}

interface SettingsTabLinkProps {
  href:   string
  label:  string
  icon:   string
  active: boolean
}

function SettingsTabLink({ href, label, icon, active }: SettingsTabLinkProps) {
  return (
    <a
      href={href}
      className={[
        'flex items-center gap-xs px-md py-sm label-md transition-colors border-b-2 -mb-px',
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-on-surface-variant hover:text-on-surface',
      ].join(' ')}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </a>
  )
}

interface AccountTabProps { email: string | null }

function AccountTab({ email }: AccountTabProps) {
  return (
    <div className="grid gap-lg">
      <ProfileSection email={email} />
      <SecuritySection email={email} />
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
