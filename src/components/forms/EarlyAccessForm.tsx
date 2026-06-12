"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { saveSubmission } from "@/lib/submissions";
import type { EarlyAccessType } from "@/lib/types";

type EarlyAccessFormProps = {
  type: EarlyAccessType;
  title?: string;
  description?: string;
};

export function EarlyAccessForm({ type, title, description }: EarlyAccessFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const submittedAt = new Date().toISOString();

    // TODO: Supabase insert — replace localStorage persistence
    if (type === "restaurant") {
      saveSubmission({
        type: "restaurant",
        businessName: String(form.get("businessName") ?? ""),
        contactName: String(form.get("contactName") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        address: String(form.get("address") ?? ""),
        estimatedMonthlyOrders: String(form.get("estimatedMonthlyOrders") ?? ""),
        currentDeliveryApp: String(form.get("currentDeliveryApp") ?? ""),
        notes: String(form.get("notes") ?? ""),
        submittedAt,
      });
    } else if (type === "driver") {
      saveSubmission({
        type: "driver",
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        zipCode: String(form.get("zipCode") ?? ""),
        availability: String(form.get("availability") ?? ""),
        vehicleType: String(form.get("vehicleType") ?? ""),
        notes: String(form.get("notes") ?? ""),
        submittedAt,
      });
    } else {
      saveSubmission({
        type: "customer",
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        zipCode: String(form.get("zipCode") ?? ""),
        submittedAt,
      });
    }

    setLoading(false);
    setSubmitted(true);
    e.currentTarget.reset();
  }

  const titles = {
    restaurant: "Join as a Restaurant",
    driver: "Apply to Drive",
    customer: "Join the Waitlist",
  };

  const descriptions = {
    restaurant: "Tell us about your restaurant. We'll reach out about early access in 19348.",
    driver: "Local drivers first. Clear pay, local routes.",
    customer: "Be first to order local when Eat76 goes live in your ZIP.",
  };

  if (submitted) {
    return (
      <Card className="text-center">
        <p className="text-lg font-semibold text-eat-blue">You&apos;re on the list.</p>
        <p className="mt-2 text-sm text-eat-muted">
          Thanks for your interest in Eat76. We&apos;ll be in touch soon.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Submit another
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-xl font-bold text-eat-ink">
        {title ?? titles[type]}
      </h3>
      <p className="mt-2 text-sm text-eat-muted">
        {description ?? descriptions[type]}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        {type === "restaurant" && (
          <>
            <Input name="businessName" label="Business name" required />
            <Input name="contactName" label="Contact name" required />
            <Input name="email" label="Email" type="email" required />
            <Input name="phone" label="Phone" type="tel" required />
            <Input name="address" label="Address" required />
            <Input
              name="estimatedMonthlyOrders"
              label="Estimated monthly delivery orders"
              type="number"
              min={0}
            />
            <Select
              name="currentDeliveryApp"
              label="Current delivery app used"
              options={[
                { value: "", label: "Select one" },
                { value: "doordash", label: "DoorDash" },
                { value: "ubereats", label: "Uber Eats" },
                { value: "grubhub", label: "Grubhub" },
                { value: "multiple", label: "Multiple apps" },
                { value: "none", label: "None yet" },
              ]}
            />
            <TextArea name="notes" label="Notes" />
          </>
        )}

        {type === "driver" && (
          <>
            <Input name="name" label="Name" required />
            <Input name="email" label="Email" type="email" required />
            <Input name="phone" label="Phone" type="tel" required />
            <Input name="zipCode" label="ZIP code" defaultValue="19348" required />
            <Input name="availability" label="Availability" placeholder="Evenings, weekends..." />
            <Select
              name="vehicleType"
              label="Vehicle type"
              options={[
                { value: "", label: "Select one" },
                { value: "sedan", label: "Sedan" },
                { value: "suv", label: "SUV" },
                { value: "hybrid", label: "Hybrid" },
                { value: "other", label: "Other" },
              ]}
            />
            <TextArea name="notes" label="Notes" />
          </>
        )}

        {type === "customer" && (
          <>
            <Input name="name" label="Name" required />
            <Input name="email" label="Email" type="email" required />
            <Input name="zipCode" label="ZIP code" defaultValue="19348" required />
          </>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Card>
  );
}
