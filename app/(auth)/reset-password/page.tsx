import { AuthHeader }       from '@/components/auth/AuthHeader'
import { AuthFooter }       from '@/components/auth/AuthFooter'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-md md:p-lg relative overflow-hidden">
      <BackgroundGlow />
      <AuthHeader />
      <main className="w-full max-w-[440px] z-10">
        {token
          ? <ResetPasswordForm token={token} />
          : <InvalidLinkPanel />
        }
      </main>
      <AuthFooter />
    </div>
  )
}

function BackgroundGlow() {
  return (
    <>
      <div className="auth-bg-glow top-0 -left-48" />
      <div className="auth-bg-glow bottom-0 -right-48" />
    </>
  )
}

function InvalidLinkPanel() {
  return (
    <div className="glass-card rounded-xl p-lg md:p-xl shadow-xl flex flex-col gap-lg text-center">
      <span className="material-symbols-outlined text-[48px] text-error mx-auto">link_off</span>
      <div className="space-y-sm">
        <h1 className="title-md text-on-surface">Invalid reset link</h1>
        <p className="body-md text-on-surface-variant">
          This link is missing a reset token. Please request a new password reset.
        </p>
      </div>
      <a href="/forgot-password" className="label-sm text-primary hover:underline">
        Request a new reset link
      </a>
    </div>
  )
}
