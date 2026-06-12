import type { FaqItem } from "@/components/ui/FaqAccordion";

export const restaurantFaqs: FaqItem[] = [
  {
    question: "What does Eat76 cost during launch?",
    answer:
      "No monthly fee. You pay 17.76% on your first 150 delivery orders each month, then 12% for orders 151+. Customer service and delivery fees are separate and transparent to diners.",
  },
  {
    question: "Do I need Stripe Connect?",
    answer:
      "Yes, for live payouts. Restaurants onboard via Stripe Connect (recipient) so food sales land in your account minus the Eat76 platform fee. Demo mode works without keys.",
  },
  {
    question: "Can I keep my existing delivery apps?",
    answer:
      "Many partners run Eat76 alongside other channels during launch. You own your customer relationship and menu on Eat76. We don't mark up your prices.",
  },
  {
    question: "How fast can we go live in 19348?",
    answer:
      "Early access restaurants in Kennett Square can be onboarded in days once menu and Connect are set. Submit the form and we'll schedule a walkthrough.",
  },
];

export const driverFaqs: FaqItem[] = [
  {
    question: "How much do drivers earn per delivery?",
    answer:
      "$6.76 minimum base pay per delivery plus 100% of customer tips. Peak bonuses and longer-zone runs may add on top, shown before you claim.",
  },
  {
    question: "Is this full-time or flexible?",
    answer:
      "Flexible. Claim deliveries when you're available. We're building density in 19348 first so routes stay local and efficient.",
  },
  {
    question: "What do I need to apply?",
    answer:
      "Valid license, insured vehicle, smartphone, and familiarity with Kennett Square / 19348 area. Submit the apply form and we'll reach out for onboarding.",
  },
  {
    question: "When do drivers get paid?",
    answer:
      "Stripe Connect payouts for tips and base pay follow your connected account schedule once live payments are enabled. Demo dashboard shows sample runs today.",
  },
];
