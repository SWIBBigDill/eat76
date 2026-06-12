import { LogoMark } from "@/components/brand/LogoMark";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-eat-soft via-white to-white eat-section">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-eat-blue/5 motion-reduce:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-eat-red/5 motion-reduce:hidden"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          <LogoMark size={72} className="mb-5 animate-fade-in" />
          <p className="text-sm font-semibold uppercase tracking-wider text-eat-red animate-fade-in">
            Launching in 19348
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-eat-ink md:text-5xl lg:text-6xl animate-fade-in-up">
            Order local.{" "}
            <span className="text-eat-blue">Know what you pay.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-eat-muted md:text-xl animate-fade-in-up">
            Hungry for something good nearby? Browse Kennett Square favorites
            with transparent fees. No mystery checkout pile-on.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center animate-fade-in-up">
            <Button href="/order" className="tap-target px-8 py-4 text-base shadow-md">
              Order Now
            </Button>
            <Button href="#savings" variant="outline" className="tap-target px-8 py-4 text-base">
              See your savings
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-eat-muted animate-fade-in">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-eat-blue">$1.76</span> service
            </span>
            <span className="hidden sm:inline text-eat-border">·</span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-eat-blue">$4.76</span> delivery
            </span>
            <span className="hidden sm:inline text-eat-border">·</span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-eat-red">100%</span> tips to driver
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
