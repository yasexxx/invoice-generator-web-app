const LOGOS = ['FINTECH', 'GLOBO', 'NEXUS', 'VERTEX', 'ORBIT'] as const

export function SocialProofBanner() {
  return (
    <section className="py-xl bg-surface-container-low border-y border-outline-variant/10">
      <div className="max-w-[1200px] mx-auto px-lg">
        <p className="text-center label-sm text-text-muted uppercase tracking-widest mb-lg">
          Trusted by 10,000+ businesses worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-xxl opacity-50 grayscale hover:grayscale-0 transition-all">
          {LOGOS.map((name) => (
            <span key={name} className="headline-lg font-bold">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
