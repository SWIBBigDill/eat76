/** Open-Meteo weather helpers for Kennett Square (ZIP 19348) */

export type LocalWeather = {
  tempF: number;
  condition: string;
  isRainyOrSnowy: boolean;
};

/** WMO weather code groups that mean wet or icy roads */
const RAINY_OR_SNOWY_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86,
  95, 96, 99,
]);

/** Map a WMO weather code to a friendly, plain-text condition label */
export function conditionFromWeatherCode(code: number): string {
  if (code === 0) return "clear";
  if (code === 1) return "mostly clear";
  if (code === 2) return "partly cloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "foggy";
  if (code >= 51 && code <= 57) return "drizzling";
  if ((code >= 61 && code <= 65) || code === 80 || code === 81 || code === 82)
    return "rainy";
  if (code === 66 || code === 67) return "freezing rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snowy";
  if (code >= 95) return "stormy";
  return "cloudy";
}

export function isRainyOrSnowyCode(code: number): boolean {
  return RAINY_OR_SNOWY_CODES.has(code);
}
