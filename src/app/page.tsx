import { CustomerPricingStrip } from "@/components/home/CustomerPricingStrip";
import { FeaturedRestaurants } from "@/components/home/FeaturedRestaurants";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { LaunchLocalSection } from "@/components/home/LaunchLocalSection";
import { PartnerSection } from "@/components/home/PartnerSection";
import { SavingsTeaser } from "@/components/home/SavingsTeaser";
import { PageShell } from "@/components/layout/PageShell";

export default function HomePage() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <HeroSection />
      <FeaturedRestaurants />
      <HowItWorksSection />
      <CustomerPricingStrip />
      <SavingsTeaser />
      <LaunchLocalSection />
      <PartnerSection />
    </PageShell>
  );
}
