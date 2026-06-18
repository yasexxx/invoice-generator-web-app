import { AuthHeader }    from '@/components/auth/AuthHeader'
import { AuthFooter }    from '@/components/auth/AuthFooter'
import { Brand }         from '@/components/ui'
import { verifyEmailApi } from '@/lib/auth/authApi'

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-md md:p-lg relative overflow-hidden">
      <BackgroundGlow />
      <AuthHeader />
      <main className="w-full max-w-[440px] z-10">
        {token
          ? <TokenVerificationPanel token={token} />
          : <CheckInboxPanel />
        }
      </main>
      <AuthFooter />
    </div>
  )
}

async function TokenVerificationPanel({ token }: { token: string }) {
  try {
    await verifyEmailApi(token)
    return <VerifiedPanel />
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed'
    return <VerificationErrorPanel message={message} />
  }
}

function CheckInboxPanel() {
  return (
    <div className="glass-card rounded-xl p-lg md:p-xl shadow-xl flex flex-col gap-lg text-center">
      <span className="material-symbols-outlined text-[56px] text-primary mx-auto">mark_email_unread</span>
      <div className="space-y-sm">
        <h1 className="title-md text-on-surface">Verify your email</h1>
        <p className="body-md text-on-surface-variant">
          We&apos;ve sent a verification link to your email address. Click the link to activate your{' '}
          <Brand /> account.
        </p>
      </div>
      <p className="label-sm text-on-surface-variant/70">
        Didn&apos;t receive it? Check your spam folder.
      </p>
      <a href="/login" className="label-sm text-primary hover:underline">
        Back to login
      </a>
    </div>
  )
}

function VerifiedPanel() {
  return (
    <div className="glass-card rounded-xl p-lg md:p-xl shadow-xl flex flex-col gap-lg text-center">
      <span className="material-symbols-outlined text-[56px] text-primary mx-auto">verified</span>
      <div className="space-y-sm">
        <h1 className="title-md text-on-surface">Email verified</h1>
        <p className="body-md text-on-surface-variant">
          Your account is now active. Log in to get started.
        </p>
      </div>
      <a
        href="/login"
        className="label-md text-primary font-semibold hover:underline"
      >
        Log in now
      </a>
    </div>
  )
}

interface VerificationErrorPanelProps { message: string }

function VerificationErrorPanel({ message }: VerificationErrorPanelProps) {
  return (
    <div className="glass-card rounded-xl p-lg md:p-xl shadow-xl flex flex-col gap-lg text-center">
      <span className="material-symbols-outlined text-[56px] text-error mx-auto">error</span>
      <div className="space-y-sm">
        <h1 className="title-md text-on-surface">Verification failed</h1>
        <p className="body-md text-on-surface-variant">{message}</p>
      </div>
      <div className="flex flex-col gap-sm">
        <a href="/register" className="label-sm text-primary hover:underline">
          Register again
        </a>
        <a href="/login" className="label-sm text-on-surface-variant hover:underline">
          Back to login
        </a>
      </div>
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
