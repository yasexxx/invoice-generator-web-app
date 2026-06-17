function HeroText() {
  return (
    <div className="z-10 text-center lg:text-left">
      <span className="inline-block px-md py-xs rounded-full bg-primary-container/30 text-primary label-sm mb-md border border-primary/20">
        NEW: Automated Tax Reporting
      </span>

      <h1 className="display-lg mb-md leading-tight">
        Invoicing made{' '}
        <span className="text-primary italic">effortless</span>
      </h1>

      <p className="body-lg text-text-muted mb-xl mx-auto lg:mx-0">
        The modern financial stack for freelancers and growing businesses. Generate professional
        invoices, track payments, and get paid 2x faster with our smart automation tools.
      </p>

      <HeroCTAs />
      <HeroSocialProof />
    </div>
  )
}

function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-md justify-center lg:justify-start">
      <button className="bg-primary-container text-text-primary px-xl py-md rounded-lg font-bold text-lg active:scale-95 transition-all shadow-lg hover:brightness-110">
        Get Started Free
      </button>
      <button className="border border-outline-variant text-on-surface px-xl py-md rounded-lg font-medium hover:bg-surface-variant transition-all flex items-center justify-center gap-sm">
        <span className="material-symbols-outlined text-[22px] leading-none">play_circle</span>
        View Demo
      </button>
    </div>
  )
}

function HeroSocialProof() {
  return (
    <div className="mt-lg flex items-center justify-center lg:justify-start gap-md text-text-muted">
      <div className="flex -space-x-2">
        {['JD', 'AS', 'MK'].map((initials) => (
          <div
            key={initials}
            className="w-8 h-8 rounded-full bg-surface-container border-2 border-background flex items-center justify-center text-[10px] font-bold"
          >
            {initials}
          </div>
        ))}
      </div>
      <span className="label-sm italic">Trusted by 10k+ professionals</span>
    </div>
  )
}

function HeroMockInvoice() {
  return (
    <div className="relative hidden lg:block pb-10 pl-10">
      <div className="glass-card p-md rounded-xl rotate-3 shadow-2xl relative">
        <MockInvoiceDocument />
        <PaymentChip />
      </div>
    </div>
  )
}

function MockInvoiceDocument() {
  return (
    <div className="bg-white text-gray-800 rounded-lg p-6 text-sm shadow-inner min-w-[280px]">
      <div className="flex justify-between mb-4">
        <div>
          <div className="text-lg font-bold">INVOICE</div>
          <div className="text-gray-400">#INV-2024-001</div>
        </div>
        <div className="text-right">
          <div className="font-semibold">Acme Corp</div>
          <div className="text-gray-400 text-xs">Due Nov 08, 2024</div>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-3 space-y-2">
        <div className="flex justify-between">
          <span>UX Design Services</span>
          <span className="font-bold">$2,500.00</span>
        </div>
        <div className="flex justify-between">
          <span>Brand Strategy</span>
          <span className="font-bold">$1,200.00</span>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between">
        <span className="font-bold">Total</span>
        <span className="font-extrabold text-indigo-600">$4,125.00</span>
      </div>
    </div>
  )
}

function PaymentChip() {
  return (
    <div className="absolute -bottom-6 -left-6 glass-card p-sm rounded-lg shadow-xl animate-bounce">
      <div className="flex items-center gap-sm">
        <div className="bg-success/20 p-xs rounded-full">
          <span className="material-symbols-outlined text-success text-[20px] leading-none">check_circle</span>
        </div>
        <span className="label-sm text-on-surface">Payment Received: $2,450.00</span>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      className="relative pt-xxl pb-xl"
      style={{
        background:
          'radial-gradient(circle at 50% 50%, rgba(67,61,139,0.15) 0%, rgba(16,14,52,0) 70%)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-lg grid lg:grid-cols-2 gap-xl items-center">
        <HeroText />
        <HeroMockInvoice />
      </div>
    </section>
  )
}
