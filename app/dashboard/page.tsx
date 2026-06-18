import { cookies }       from 'next/headers'
import { Brand, Button } from '@/components/ui'
import { logoutAction }  from '@/lib/auth/actions'

const AUTH_TOKEN_COOKIE = 'auth_token'
const JWT_PART_COUNT    = 3
const PAYLOAD_INDEX     = 1

async function getUserEmail(): Promise<string | null> {
  const jar   = await cookies()
  const token = jar.get(AUTH_TOKEN_COOKIE)?.value
  if (!token) return null

  const parts = token.split('.')
  if (parts.length !== JWT_PART_COUNT) return null

  try {
    const payload = Buffer.from(parts[PAYLOAD_INDEX], 'base64url').toString('utf-8')
    const claims  = JSON.parse(payload) as { email?: string }
    return claims.email ?? null
  } catch {
    return null
  }
}

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

interface NavProps { email: string | null }

function DashboardNav({ email }: NavProps) {
  return (
    <header className="border-b border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-lg py-md">
        <Brand showIcon size="sm" />
        <div className="flex items-center gap-md">
          {email && (
            <span className="label-sm text-on-surface-variant hidden sm:block">{email}</span>
          )}
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Log out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}

interface WelcomeBannerProps { email: string | null }

function WelcomeBanner({ email }: WelcomeBannerProps) {
  return (
    <div className="mb-xl">
      <h1 className="headline-lg text-on-surface">
        {email ? `Welcome back` : 'Welcome'}
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
        href="/invoice"
      />
      <ActionCard
        icon="person"
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
    <a
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
    </a>
  )
}
