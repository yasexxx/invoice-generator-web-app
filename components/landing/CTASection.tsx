import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-xxl max-w-[1200px] mx-auto px-lg">
      <div className="glass-card p-xl md:p-xxl rounded-3xl text-center relative overflow-hidden">
        <CTABlobs />
        <CTAContent />
      </div>
    </section>
  )
}

function CTABlobs() {
  return (
    <>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
    </>
  )
}

function CTAContent() {
  return (
    <div className="relative z-10">
      <h2 className="display-lg mb-md">Ready to simplify your billing?</h2>
      <p className="text-text-muted mb-xl mx-auto">
        Join 10,000+ businesses who have reclaimed their time with Invoicely. Start your
        14-day free trial today.
      </p>
      <div className="flex flex-col sm:flex-row gap-md justify-center">
        <Link href="/register" className="bg-primary-container text-text-primary px-xl py-md rounded-lg font-bold text-lg active:scale-95 transition-all shadow-lg hover:brightness-110">
          Get Started Free
        </Link>
        <Link href="/contact" className="text-on-surface px-xl py-md rounded-lg font-medium hover:text-primary transition-all underline underline-offset-4">
          Contact Sales Team
        </Link>
      </div>
    </div>
  )
}
