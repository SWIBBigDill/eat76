import Image from "next/image";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { restaurants } from "@/data/restaurants";
import type { Restaurant } from "@/lib/types";

const COLLAGE_IDS = ["talulas-table", "la-verona", "portabellos"];
const AVATAR_IDS = [
  "lily-asian-cuisine",
  "lettys-tavern",
  "floga-bistro",
  "michoacana-grill",
];

function withPhotos(ids: string[]): Restaurant[] {
  return ids
    .map((id) => restaurants.find((r) => r.id === id))
    .filter((r): r is Restaurant => Boolean(r?.image?.endsWith(".jpg")));
}

function marqueeNames(): string[] {
  return [...restaurants]
    .filter((r) => r.zone === "kennett-square")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 14)
    .map((r) => r.name);
}

export function HeroSection() {
  const collage = withPhotos(COLLAGE_IDS);
  const avatars = withPhotos(AVATAR_IDS);
  const names = marqueeNames();
  const spotlight = collage[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-eat-soft via-white to-white">
      <div
        className="eat-dots pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-eat-blue/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-eat-red/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-10 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pb-20">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-eat-red/20 bg-eat-red/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-eat-red animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-eat-red/60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-eat-red" />
            </span>
            Launching in 19348
          </span>

          <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-eat-ink md:text-5xl lg:text-6xl animate-fade-in-up">
            Order local.{" "}
            <span className="text-eat-blue">Know what you pay.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-eat-muted md:text-xl animate-fade-in-up">
            Kennett Square favorites, delivered by neighbors. Flat fees you can
            read before checkout, never a mystery pile-on.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:justify-start animate-fade-in-up">
            <Button
              href="/order"
              className="tap-target px-8 py-4 text-base shadow-lg shadow-eat-blue/25"
            >
              Order Now
            </Button>
            <Button
              href="#savings"
              variant="outline"
              className="tap-target bg-white/80 px-8 py-4 text-base backdrop-blur"
            >
              See your savings
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start animate-fade-in">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-eat-border bg-white px-3.5 py-2 text-xs font-semibold text-eat-ink shadow-sm">
              <span className="font-bold text-eat-blue">$1.76</span> service fee
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-eat-border bg-white px-3.5 py-2 text-xs font-semibold text-eat-ink shadow-sm">
              <span className="font-bold text-eat-blue">$4.76</span> delivery
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-eat-border bg-white px-3.5 py-2 text-xs font-semibold text-eat-ink shadow-sm">
              <span className="font-bold text-eat-red">100%</span> tips to
              drivers
            </span>
          </div>

          {avatars.length > 0 && (
            <div className="mt-7 flex items-center justify-center gap-3 lg:justify-start animate-fade-in">
              <div className="flex -space-x-3">
                {avatars.map((r) => (
                  <span
                    key={r.id}
                    className="relative block h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-sm"
                  >
                    <Image
                      src={r.image!}
                      alt={r.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>
              <p className="text-sm text-eat-muted">
                <span className="font-bold text-eat-ink">
                  {restaurants.length}+ local spots
                </span>{" "}
                ready when you are
              </p>
            </div>
          )}
        </div>

        {collage.length >= 3 && (
          <div className="relative mx-auto h-[320px] w-full max-w-md sm:h-[380px] lg:h-[460px] lg:max-w-none animate-fade-in">
            <div
              className="absolute left-0 top-5 h-[76%] w-[60%] overflow-hidden rounded-3xl border-4 border-white shadow-xl"
              style={{ transform: "rotate(-2deg)" }}
            >
              <Image
                src={collage[0].image!}
                alt={`Food from ${collage[0].name} in Kennett Square`}
                fill
                sizes="(max-width: 1024px) 60vw, 30vw"
                className="object-cover"
                preload
              />
            </div>
            <div
              className="animate-float-soft absolute right-0 top-0 h-[42%] w-[40%] overflow-hidden rounded-3xl border-4 border-white shadow-lg"
              style={{ "--float-rotate": "2.5deg" } as CSSProperties}
            >
              <Image
                src={collage[1].image!}
                alt={`Food from ${collage[1].name} in Kennett Square`}
                fill
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="object-cover"
              />
            </div>
            <div
              className="animate-float-softer absolute bottom-0 right-[4%] h-[40%] w-[44%] overflow-hidden rounded-3xl border-4 border-white shadow-lg"
              style={{ "--float-rotate": "-1.5deg" } as CSSProperties}
            >
              <Image
                src={collage[2].image!}
                alt={`Food from ${collage[2].name} in Kennett Square`}
                fill
                sizes="(max-width: 1024px) 44vw, 22vw"
                className="object-cover"
              />
            </div>

            <div className="animate-float-soft absolute bottom-[10%] left-[2%] flex items-center gap-2.5 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-eat-blue/10 text-base">
                ★
              </span>
              <span>
                <span className="block text-sm font-bold text-eat-ink">
                  {spotlight.rating} rated
                </span>
                <span className="block text-xs text-eat-muted">
                  {spotlight.name}
                </span>
              </span>
            </div>
            <div className="animate-float-softer absolute right-[2%] top-[46%] flex items-center gap-2.5 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-eat-red/10 text-base">
                🚗
              </span>
              <span>
                <span className="block text-sm font-bold text-eat-ink">
                  Local drivers
                </span>
                <span className="block text-xs text-eat-muted">
                  100% of tips, always
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="relative border-y border-eat-border/70 bg-white/70 py-3 backdrop-blur">
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap pl-8 text-sm font-semibold text-eat-muted">
            {[...names, ...names].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex items-center gap-8"
                aria-hidden={i >= names.length}
              >
                <span>{name}</span>
                <span className="text-eat-red" aria-hidden>
                  •
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
