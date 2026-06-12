/**
 * Server-side street routing via the public OSRM demo server.
 *
 * Fetches the real driving route from the demo restaurant to the demo
 * customer once, caches it in module scope, and interpolates the driver
 * position along actual streets. Falls back silently to the straight-line
 * estimate from driver-location.ts if OSRM is unreachable or slow.
 */

import {
  DEMO_CUSTOMER,
  DEMO_RESTAURANT,
  driverPositionAlongRoute,
  type LatLng,
} from "@/lib/driver-location";

const OSRM_URL =
  "https://router.project-osrm.org/route/v1/driving/" +
  `${DEMO_RESTAURANT.lng},${DEMO_RESTAURANT.lat};${DEMO_CUSTOMER.lng},${DEMO_CUSTOMER.lat}` +
  "?overview=full&geometries=geojson";

const FETCH_TIMEOUT_MS = 3000;
const RETRY_AFTER_FAILURE_MS = 5 * 60 * 1000;

type OsrmResponse = {
  routes?: Array<{
    geometry?: { coordinates?: Array<[number, number]> };
  }>;
};

let cachedRoute: LatLng[] | null = null;
let pendingFetch: Promise<LatLng[] | null> | null = null;
let lastFailureAt = 0;

async function fetchStreetRoute(): Promise<LatLng[] | null> {
  try {
    const res = await fetch(OSRM_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as OsrmResponse;
    const coordinates = data.routes?.[0]?.geometry?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

    const points = coordinates
      .filter(
        (pair): pair is [number, number] =>
          Array.isArray(pair) &&
          typeof pair[0] === "number" &&
          typeof pair[1] === "number"
      )
      .map(([lng, lat]) => ({ lat, lng }));
    return points.length >= 2 ? points : null;
  } catch {
    return null;
  }
}

async function getStreetRoute(): Promise<LatLng[] | null> {
  if (cachedRoute) return cachedRoute;
  if (Date.now() - lastFailureAt < RETRY_AFTER_FAILURE_MS) return null;

  if (!pendingFetch) {
    pendingFetch = fetchStreetRoute().then((route) => {
      pendingFetch = null;
      if (route) {
        cachedRoute = route;
      } else {
        lastFailureAt = Date.now();
      }
      return route;
    });
  }
  return pendingFetch;
}

function segmentLength(a: LatLng, b: LatLng): number {
  // Equirectangular approximation, plenty accurate over ~1 mile
  const latScale = Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180);
  const dLat = b.lat - a.lat;
  const dLng = (b.lng - a.lng) * latScale;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

function interpolateAlong(points: LatLng[], progress: number): LatLng {
  const t = Math.min(1, Math.max(0, progress));
  if (t === 0) return points[0];
  if (t === 1) return points[points.length - 1];

  const lengths: number[] = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const len = segmentLength(points[i], points[i + 1]);
    lengths.push(len);
    total += len;
  }
  if (total === 0) return points[0];

  let target = t * total;
  for (let i = 0; i < lengths.length; i++) {
    if (target <= lengths[i]) {
      const f = lengths[i] === 0 ? 0 : target / lengths[i];
      return {
        lat: points[i].lat + (points[i + 1].lat - points[i].lat) * f,
        lng: points[i].lng + (points[i + 1].lng - points[i].lng) * f,
      };
    }
    target -= lengths[i];
  }
  return points[points.length - 1];
}

/**
 * Driver position along the real street route for a 0-1 progress value.
 * Falls back to the straight-line position if OSRM is unavailable.
 */
export async function driverPositionAlongStreetRoute(
  progress: number
): Promise<LatLng> {
  const route = await getStreetRoute();
  if (!route) return driverPositionAlongRoute(progress);
  return interpolateAlong(route, progress);
}
