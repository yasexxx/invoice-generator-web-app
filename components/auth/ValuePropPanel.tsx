const VALUE_PROPS = [
  {
    icon: 'bolt',
    title: 'Instant Invoicing',
    description: 'Create professional invoices in seconds.',
  },
  {
    icon: 'security',
    title: 'Bank-Grade Security',
    description: 'Your financial data is encrypted 24/7.',
  },
] as const

export function ValuePropPanel() {
  return (
    <div className="hidden md:flex flex-col justify-between p-xl bg-primary-container/20 relative overflow-hidden">
      <ValuePropContent />
      <ValuePropFeatures />
      <DecorativeIcon />
    </div>
  )
}

function ValuePropContent() {
  return (
    <div className="relative z-10">
      <h1 className="display-lg text-primary mb-md">
        Financial clarity for your business.
      </h1>
      <p className="body-lg text-on-surface-variant max-w-[320px]">
        Join 50,000+ businesses automating their invoicing and getting paid faster.
      </p>
    </div>
  )
}

function ValuePropFeatures() {
  return (
    <div className="relative z-10 mt-xxl space-y-md">
      {VALUE_PROPS.map(({ icon, title, description }) => (
        <div key={title} className="flex items-center gap-md">
          <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">{icon}</span>
          </div>
          <div>
            <p className="title-md text-on-surface">{title}</p>
            <p className="label-sm text-text-muted">{description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function DecorativeIcon() {
  return (
    <div className="absolute bottom-[-10%] right-[-5%] opacity-20 pointer-events-none select-none">
      <span
        className="material-symbols-outlined text-primary"
        style={{ fontSize: '300px', fontVariationSettings: "'FILL' 1" }}
      >
        receipt_long
      </span>
    </div>
  )
}
