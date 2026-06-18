import Link             from 'next/link'
import { Brand }        from '@/components/ui'
import { AuthFooter }   from '@/components/auth/AuthFooter'
import { ValuePropPanel }  from '@/components/auth/ValuePropPanel'
import { RegisterForm }    from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <>
      <RegisterBackground />
      <RegisterHeader />
      <main className="relative z-10 min-h-[calc(100vh-140px)] flex items-center justify-center px-md md:px-lg py-lg">
        <div className="w-full max-w-[1000px] grid md:grid-cols-2 overflow-hidden rounded-xl shadow-2xl glass-card">
          <ValuePropPanel />
          <RegisterForm />
        </div>
      </main>
      <AuthFooter />
    </>
  )
}

function RegisterBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary-container/20 blur-[120px] rounded-full" />
    </div>
  )
}

function RegisterHeader() {
  return (
    <header className="relative z-50 flex items-center justify-between px-lg py-md max-w-[1200px] mx-auto">
      <Brand showIcon />
      <Link href="contact" className="label-md text-on-surface-variant hover:text-primary transition-colors">
        Help Center
      </Link>
    </header>
  )
}
