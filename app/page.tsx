import { TopNav }           from '@/components/layout/TopNav'
import { Footer }            from '@/components/layout/Footer'
import { HeroSection }       from '@/components/landing/HeroSection'
import { SocialProofBanner } from '@/components/landing/SocialProofBanner'
import { FeaturesSection }   from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { CTASection }        from '@/components/landing/CTASection'

export default function LandingPage() {
  return (
    <>
      <TopNav />
      <main className="pt-xxl">
        <HeroSection />
        <SocialProofBanner />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
