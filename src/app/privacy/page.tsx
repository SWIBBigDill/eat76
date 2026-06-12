import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Privacy Policy | Eat76",
  description: "How Eat76 collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <PageShell className="pb-20 md:pb-0">
      <section className="eat-section">
        <div className="mx-auto max-w-2xl px-4 prose-eat">
          <SectionHeading
            title="Privacy Policy"
            subtitle="Last updated June 12, 2026"
          />

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-eat-ink">
            <p>
              Eat76 (&quot;we,&quot; &quot;us&quot;) operates local food delivery for the Kennett Square
              area. This policy explains what we collect and how we use it when you order, track
              deliveries, or partner with us as a restaurant or driver.
            </p>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Information we collect</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-eat-muted">
                <li>Account details such as name and email when you sign in</li>
                <li>Delivery address and order details needed to fulfill your order</li>
                <li>Payment information processed by Stripe (we do not store full card numbers)</li>
                <li>Device and usage data such as browser type and pages visited</li>
                <li>Location data when you enable delivery tracking or driver features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">How we use information</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-eat-muted">
                <li>Process orders, payments, and delivery coordination</li>
                <li>Send order status updates and support responses</li>
                <li>Improve the Eat76 app and local marketplace operations</li>
                <li>Meet legal, tax, and fraud-prevention obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Sharing</h2>
              <p className="mt-2 text-eat-muted">
                We share order and delivery details with the restaurant fulfilling your order and
                the driver assigned to deliver it. Payment data is handled by Stripe under their
                privacy policy. We do not sell your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Retention and security</h2>
              <p className="mt-2 text-eat-muted">
                We keep order records as needed for operations, accounting, and dispute resolution.
                We use HTTPS, access controls, and reputable payment processors to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Your choices</h2>
              <p className="mt-2 text-eat-muted">
                You may request access, correction, or deletion of your account data by contacting{" "}
                <a href="mailto:privacy@eat76.com" className="font-semibold text-eat-blue hover:underline">
                  privacy@eat76.com
                </a>
                . You can disable browser notifications in your device settings.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Children</h2>
              <p className="mt-2 text-eat-muted">
                Eat76 is not directed to children under 13. We do not knowingly collect data from children.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-eat-ink">Contact</h2>
              <p className="mt-2 text-eat-muted">
                Eat76 · Kennett Square, PA 19348 ·{" "}
                <a href="mailto:privacy@eat76.com" className="font-semibold text-eat-blue hover:underline">
                  privacy@eat76.com
                </a>
              </p>
            </section>

            <p className="text-eat-muted">
              See also our{" "}
              <Link href="/terms" className="font-semibold text-eat-blue hover:underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
