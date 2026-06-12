import { Button } from "@/components/ui/Button";

export function OrderBanner() {
  return (
    <div className="border-b border-eat-blue/20 bg-gradient-to-r from-eat-blue/5 to-eat-red/5">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row">
        <p className="text-center text-sm font-medium text-eat-ink sm:text-left">
          <span className="font-bold text-eat-blue">Looking to order?</span>{" "}
          Browse local restaurants with transparent fees.
        </p>
        <Button href="/order" className="shrink-0 tap-target">
          Order Now
        </Button>
      </div>
    </div>
  );
}
