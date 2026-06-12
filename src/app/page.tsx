import { CustomerPricingStrip } from "@/components/home/CustomerPricingStrip";
import { FeaturedRestaurants } from "@/components/home/FeaturedRestaurants";
import { PopularNearYou } from "@/components/order/PopularNearYou";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { LaunchLocalSection } from "@/components/home/LaunchLocalSection";
import { PartnerSection } from "@/components/home/PartnerSection";
import { SavingsTeaser } from "@/components/home/SavingsTeaser";
import { PageShell } from "@/components/layout/PageShell";
import { restaurants } from "@/data/restaurants";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://eat76.vercel.app";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Eat76",
  description:
    "Local-first food delivery for Kennett Square and nearby 19348. Transparent fees, local drivers, 75+ restaurants.",
  url: appUrl,
  areaServed: {
    "@type": "PostalCode",
    postalCode: "19348",
    addressCountry: "US",
  },
  priceRange: "$$",
  servesCuisine: [...new Set(restaurants.map((r) => r.foodType.split("/")[0].trim()))].slice(0, 12),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.5",
    reviewCount: restaurants.length.toString(),
  },
};

export default function HomePage() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <HeroSection />
      <section className="eat-section pt-0">
        <div className="mx-auto max-w-6xl px-4">
          <PopularNearYou limit={4} />
        </div>
      </section>
      <FeaturedRestaurants />
      <HowItWorksSection />
      <CustomerPricingStrip />
      <SavingsTeaser />
      <LaunchLocalSection />
      <PartnerSection />
    </PageShell>
  );
}
