"use client";

import { useEffect, useState } from "react";
import type { LocalWeather } from "@/lib/weather";

/** Fetches local weather once; returns null until loaded or if unavailable */
function useLocalWeather(): LocalWeather | null {
  const [weather, setWeather] = useState<LocalWeather | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LocalWeather | null) => {
        if (!cancelled && data && typeof data.tempF === "number") {
          setWeather(data);
        }
      })
      .catch(() => {
        /* weather is a nice-to-have, fail silently */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return weather;
}

/** Small chip like "68F and clear in Kennett Square" for the browse page */
export function WeatherChip() {
  const weather = useLocalWeather();
  if (!weather) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-eat-border bg-white px-3 py-1 text-xs font-semibold text-eat-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-eat-blue" aria-hidden />
      {weather.tempF}F and {weather.condition} in Kennett Square
    </span>
  );
}

/** Subtle heads-up on the tracking page when roads are wet or snowy */
export function WeatherDeliveryNote() {
  const weather = useLocalWeather();
  if (!weather || !weather.isRainyOrSnowy) return null;

  const roads = weather.condition === "snowy" ? "snowy" : "wet";

  return (
    <p className="mt-3 rounded-xl bg-eat-soft px-3 py-2.5 text-sm text-eat-muted">
      Heads up: {roads} roads in Kennett Square right now, so your driver may
      need a few extra minutes.
    </p>
  );
}
