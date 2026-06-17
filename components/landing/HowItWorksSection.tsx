interface WorkflowStepProps {
  num: number
  title: string
  description: string
  active?: boolean
}

const STEPS: Omit<WorkflowStepProps, 'active'>[] = [
  { num: 1, title: 'Create & Customize', description: 'Add your client details and line items in seconds.' },
  { num: 2, title: 'Send Instantly',     description: 'Delivery via secure link, email, or PDF export.' },
  { num: 3, title: 'Get Paid',           description: 'Accept credit cards, bank transfers, or crypto.' },
]

function WorkflowStep({ num, title, description, active = false }: WorkflowStepProps) {
  return (
    <div className="flex gap-md items-start">
      <div
        className={`font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          active
            ? 'bg-primary text-on-primary'
            : 'bg-outline-variant text-on-surface'
        }`}
      >
        {num}
      </div>
      <div>
        <h4 className="title-md text-on-surface">{title}</h4>
        <p className="text-text-muted text-sm">{description}</p>
      </div>
    </div>
  )
}

function WorkflowLeft() {
  return (
    <div className="md:col-span-5 flex flex-col justify-center">
      <span className="label-md text-primary mb-sm">WORKFLOW</span>
      <h2 className="headline-lg mb-md">How it works</h2>
      <p className="text-text-muted mb-lg">
        Our streamlined process reduces administrative overhead by 60%, allowing you to focus on
        growth.
      </p>
      <div className="space-y-md">
        {STEPS.map((s, i) => (
          <WorkflowStep key={s.num} {...s} active={i === 0} />
        ))}
      </div>
    </div>
  )
}

function BentoGrid() {
  return (
    <div className="md:col-span-7 grid grid-cols-2 gap-md">
      <div className="bg-surface-elevated p-md rounded-xl border border-outline-variant/30 flex flex-col justify-end min-h-[240px]">
        <span className="material-symbols-outlined text-primary mb-sm">bolt</span>
        <p className="title-md text-on-surface leading-tight">Lightning Fast Processing</p>
      </div>

      <div className="bg-primary-container p-md rounded-xl border border-primary/20 flex flex-col justify-end min-h-[240px] text-text-primary">
        <span className="material-symbols-outlined mb-sm">security</span>
        <p className="title-md leading-tight">Enterprise-grade Security</p>
      </div>

      <div className="col-span-2 relative h-64 overflow-hidden rounded-xl bg-gradient-to-br from-surface-container-high to-surface-container-lowest">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_bottom_right,rgba(197,192,255,0.3)_0%,transparent_60%)]" />
        <div className="absolute bottom-md left-md">
          <p className="headline-lg-mobile text-on-surface font-semibold">Built for Scalability</p>
        </div>
      </div>
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section className="py-xxl bg-surface-container-lowest">
      <div className="max-w-[1200px] mx-auto px-lg">
        <div className="grid md:grid-cols-12 gap-lg">
          <WorkflowLeft />
          <BentoGrid />
        </div>
      </div>
    </section>
  )
}
