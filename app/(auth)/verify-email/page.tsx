import { AuthHeader }  from '@/components/auth/AuthHeader'
import { AuthFooter }  from '@/components/auth/AuthFooter'
import { Brand }       from '@/components/ui'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-md md:p-lg relative overflow-hidden">
      <BackgroundGlow />
      <AuthHeader />
      <main className="w-full max-w-[440px] z-10">
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
