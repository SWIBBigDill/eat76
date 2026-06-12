// Google Maps helpers, gated by NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
// When the key is missing every helper returns null and callers fall back
// to the existing OpenStreetMap / plain input behavior.

export const KENNETT_SQUARE_CENTER = { lat: 39.8467, lng: -75.708 };

// Rough bounding box around Kennett Square used to bias Places autocomplete.
export const KENNETT_SQUARE_BOUNDS = {
  north: 39.89,
  south: 39.8,
  east: -75.65,
  west: -75.77,
};

export function getGoogleMapsApiKey(): string | null {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null;
}

export function isGoogleMapsConfigured(): boolean {
  return Boolean(getGoogleMapsApiKey());
}

/** Maps Embed API view centered on Kennett Square. Null when no key. */
export function googleMapsEmbedViewUrl(zoom = 15): string | null {
  const key = getGoogleMapsApiKey();
  if (!key) return null;
  const { lat, lng } = KENNETT_SQUARE_CENTER;
  return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(key)}&center=${lat},${lng}&zoom=${zoom}`;
}

/** Maps Embed API driving directions. Null when no key. */
export function googleMapsEmbedDirectionsUrl(
  origin: string,
  destination: string
): string | null {
  const key = getGoogleMapsApiKey();
  if (!key) return null;
  return `https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(key)}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving`;
}

// --- Places autocomplete (Maps JavaScript API, lazy loaded) ---

export type PlaceResult = { formatted_address?: string };

export type PlacesAutocomplete = {
  addListener(eventName: "place_changed", handler: () => void): void;
  getPlace(): PlaceResult;
};

export type PlacesLibrary = {
  Autocomplete: new (
    input: HTMLInputElement,
    options?: {
      bounds?: { north: number; south: number; east: number; west: number };
      componentRestrictions?: { country: string };
      fields?: string[];
      types?: string[];
    }
  ) => PlacesAutocomplete;
};

type GoogleMapsNamespace = {
  importLibrary?: (name: string) => Promise<unknown>;
  event?: { clearInstanceListeners: (instance: object) => void };
};

declare global {
  interface Window {
    google?: { maps?: GoogleMapsNamespace };
    __eat76GoogleMapsReady?: () => void;
  }
}

let placesPromise: Promise<PlacesLibrary | null> | null = null;

/**
 * Lazy-loads the Maps JavaScript API and resolves the Places library via
 * google.maps.importLibrary. Resolves null when no key is configured or the
 * script fails to load, so callers can keep the plain input behavior.
 */
export function loadPlacesLibrary(): Promise<PlacesLibrary | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const key = getGoogleMapsApiKey();
  if (!key) return Promise.resolve(null);

  if (!placesPromise) {
    placesPromise = new Promise((resolve) => {
      const importPlaces = async () => {
        const importLibrary = window.google?.maps?.importLibrary;
        if (!importLibrary) {
          resolve(null);
          return;
        }
        try {
          resolve((await importLibrary("places")) as PlacesLibrary);
        } catch {
          resolve(null);
        }
      };

      if (window.google?.maps?.importLibrary) {
        void importPlaces();
        return;
      }

      window.__eat76GoogleMapsReady = () => void importPlaces();
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&callback=__eat76GoogleMapsReady`;
      script.async = true;
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
  }
  return placesPromise;
}

/** Detach Google Maps event listeners from an autocomplete instance. */
export function clearAutocompleteListeners(instance: PlacesAutocomplete) {
  window.google?.maps?.event?.clearInstanceListeners(instance);
}
