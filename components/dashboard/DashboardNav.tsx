import { Brand, Button } from '@/components/ui'
import { logoutAction }  from '@/lib/auth/actions'

export interface DashboardNavProps {
  email: string | null
}

export function DashboardNav({ email }: DashboardNavProps) {
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
