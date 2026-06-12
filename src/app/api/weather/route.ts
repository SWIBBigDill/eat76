import { NextResponse } from "next/server";
import {
  conditionFromWeatherCode,
  isRainyOrSnowyCode,
  type LocalWeather,
} from "@/lib/weather";

export const runtime = "nodejs";

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=39.8467&longitude=-75.708" +
  "&current=temperature_2m,precipitation,weather_code" +
  "&temperature_unit=fahrenheit";

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
};

export async function GET() {
  try {
    const res = await fetch(OPEN_METEO_URL, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Weather unavailable." }, { status: 503 });
    }

    const data = (await res.json()) as OpenMeteoResponse;
    const tempRaw = data.current?.temperature_2m;
    const code = data.current?.weather_code;
    if (typeof tempRaw !== "number" || typeof code !== "number") {
      return NextResponse.json({ error: "Weather unavailable." }, { status: 503 });
    }

    const weather: LocalWeather = {
      tempF: Math.round(tempRaw),
      condition: conditionFromWeatherCode(code),
      isRainyOrSnowy: isRainyOrSnowyCode(code),
    };
    return NextResponse.json(weather);
  } catch {
    return NextResponse.json({ error: "Weather unavailable." }, { status: 503 });
  }
}
