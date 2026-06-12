"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const TIP_ADDONS = [0, 2, 3, 5];

type RateOrderProps = {
  restaurantName: string;
  restaurantId: string;
  driverName: string;
};

export function RateOrder({ restaurantName, restaurantId, driverName }: RateOrderProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [tipAddon, setTipAddon] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Card className="text-center">
        <p className="text-lg font-bold text-eat-ink">Thanks for your feedback!</p>
        <p className="mt-2 text-sm text-eat-muted">
          Your rating helps local restaurants and drivers on Eat76.
        </p>
        <Button href={`/order/${restaurantId}`} className="mt-4">
          Order again from {restaurantName}
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-bold text-eat-ink">Rate your order</h2>
      <p className="mt-1 text-sm text-eat-muted">How was your food from {restaurantName}?</p>

      <div className="mt-4 flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="tap-target p-1 text-3xl transition-transform hover:scale-110"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${star} stars`}
          >
            <span className={(hover || rating) >= star ? "text-eat-red" : "text-eat-border"}>
              ★
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 border-t border-eat-border pt-4">
        <p className="text-sm font-semibold text-eat-ink">Add a tip for {driverName}?</p>
        <p className="text-xs text-eat-muted">Demo only. No real charge.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TIP_ADDONS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setTipAddon(amount)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tipAddon === amount
                  ? "bg-eat-red text-white"
                  : "border border-eat-border text-eat-ink hover:bg-eat-soft"
              }`}
            >
              {amount === 0 ? "No extra tip" : `+$${amount}`}
            </button>
          ))}
        </div>
      </div>

      <Button
        className="mt-6 w-full"
        disabled={rating === 0}
        onClick={() => setSubmitted(true)}
      >
        Submit rating
      </Button>
    </Card>
  );
}
