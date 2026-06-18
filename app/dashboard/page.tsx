import Link               from 'next/link'
import { getUserEmail }   from '@/lib/auth/session'
import { DashboardNav }  from '@/components/dashboard/DashboardNav'
import { Brand }         from '@/components/ui'

export default async function DashboardPage() {
  const email = await getUserEmail()

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <DashboardNav email={email} />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-lg py-xl">
        <WelcomeBanner email={email} />
        <QuickActionsRow />
      </main>
    </div>
  )
}

interface WelcomeBannerProps { email: string | null }

function WelcomeBanner({ email }: WelcomeBannerProps) {
  return (
    <div className="mb-xl">
      <div className="flex items-center gap-sm mb-sm">
        <Brand size="lg" />
      </div>
      <h1 className="headline-lg text-on-surface">
        {email ? 'Welcome back' : 'Welcome'}
      </h1>
      {email && <p className="body-md text-on-surface-variant mt-xs">{email}</p>}
    </div>
  )
}

function QuickActionsRow() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md">
      <ActionCard
        icon="add_circle"
        title="New Invoice"
        description="Create and send a professional invoice."
        href="/invoice/create"
      />
      <ActionCard
        icon="description"
        title="My Invoices"
        description="View and manage all your invoices."
        href="/invoices"
      />
      <ActionCard
        icon="manage_accounts"
        title="Account Settings"
        description="Update your profile and preferences."
        href="/settings"
      />
    </div>
  )
}

interface ActionCardProps {
  icon:        string
  title:       string
  description: string
  href:        string
}

function ActionCard({ icon, title, description, href }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="glass-card rounded-xl p-lg flex flex-col gap-sm hover:ring-1 hover:ring-primary/30 transition-all group"
    >
      <span className="material-symbols-outlined text-[32px] text-primary group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <div>
        <p className="title-sm text-on-surface">{title}</p>
        <p className="body-sm text-on-surface-variant mt-xs">{description}</p>
      </div>
    </Link>
  )
}
