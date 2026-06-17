import { AuthHeader }  from '@/components/auth/AuthHeader'
import { AuthFooter }  from '@/components/auth/AuthFooter'
import { LoginForm }   from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-md md:p-lg relative overflow-hidden">
      <BackgroundGlow />
      <AuthHeader />
      <main className="w-full max-w-[440px] z-10">
        <LoginForm />
        <p className="mt-xl text-center body-md text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className="text-primary font-semibold hover:underline decoration-primary/50 underline-offset-4 ml-xs"
          >
            Sign up
          </a>
        </p>
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
