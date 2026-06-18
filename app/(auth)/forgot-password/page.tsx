import { AuthHeader }         from '@/components/auth/AuthHeader'
import { AuthFooter }         from '@/components/auth/AuthFooter'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-md md:p-lg relative overflow-hidden">
      <BackgroundGlow />
      <AuthHeader />
      <main className="w-full max-w-[440px] z-10">
        <ForgotPasswordForm />
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
