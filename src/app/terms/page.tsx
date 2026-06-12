import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Terms of Service | Eat76",
  description: "Terms for using Eat76 local food delivery.",
};

export default function TermsPage() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <section className="eat-section">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading
            title="Terms of Service"
            subtitle="Last updated June 12, 2026"
          />

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-eat-ink">
            <p>
              By using Eat76, you agree to these terms. Eat76 connects customers with independent
              local restaurants and drivers. We are a marketplace, not the restaurant or employer
              of drivers.
            </p>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Ordering and fees</h2>
              <p className="mt-2 text-eat-muted">
                Menu prices, fees, tips, and taxes are shown before checkout. Service and delivery
                fees support local operations. Restaurants are responsible for food preparation and
                accuracy. Refunds for order issues are handled per restaurant and Eat76 support policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Payments</h2>
              <p className="mt-2 text-eat-muted">
                Payments are processed by Stripe. You authorize charges for your order total. Restaurant
                partners receive payouts via Stripe Connect when onboarded.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Delivery area</h2>
              <p className="mt-2 text-eat-muted">
                Delivery is available in supported ZIP codes near 19348. Addresses outside the service
                area cannot be fulfilled.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Account and conduct</h2>
              <p className="mt-2 text-eat-muted">
                Provide accurate contact and delivery information. Do not misuse the platform, harass
                partners, or attempt fraudulent chargebacks. We may suspend accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Disclaimer</h2>
              <p className="mt-2 text-eat-muted">
                Eat76 is provided as-is. We do not guarantee uninterrupted service. To the extent
                permitted by law, Eat76 is not liable for indirect damages arising from orders or delivery delays.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Changes</h2>
              <p className="mt-2 text-eat-muted">
                We may update these terms. Continued use after changes means you accept the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Contact</h2>
              <p className="mt-2 text-eat-muted">
                Questions:{" "}
                <a href="mailto:support@eat76.com" className="font-semibold text-eat-blue hover:underline">
                  support@eat76.com
                </a>
                . See our{" "}
                <Link href="/privacy" className="font-semibold text-eat-blue hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
