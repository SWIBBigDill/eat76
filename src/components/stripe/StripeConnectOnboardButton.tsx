"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { isStripeClientConfigured } from "@/lib/stripe/client";

const DEMO_RESTAURANT = {
  restaurantId: "eat76-demo-restaurant",
  businessName: "Eat76 Demo Restaurant",
  email: "demo@eat76.local",
};

type StripeConnectOnboardButtonProps = {
  variant?: "primary" | "accent" | "outline" | "ghost";
  className?: string;
};

export function StripeConnectOnboardButton({
  variant = "outline",
  className,
}: StripeConnectOnboardButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const stripeReady = isStripeClientConfigured();

  async function handleConnect() {
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/connect/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEMO_RESTAURANT),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (response.status === 503) {
        setMessage(
          "Stripe is not configured yet. Add platform keys to Vercel (see docs/STRIPE_SETUP.md), then try again."
        );
        return;
      }

      if (!response.ok || !data.url) {
        setMessage(data.error ?? "Could not start Connect onboarding. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setMessage("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        className="tap-target"
        disabled={loading}
        onClick={handleConnect}
      >
        {loading ? "Starting Connect…" : "Connect Stripe (Restaurant Demo)"}
      </Button>
      {!stripeReady && !message && (
        <p className="mt-2 text-xs text-eat-muted">
          Demo mode — Stripe keys not detected. Checkout and payouts stay simulated until keys are added.
        </p>
      )}
      {message && (
        <p className="mt-2 text-sm text-eat-red" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
