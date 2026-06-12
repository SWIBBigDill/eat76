"use client";

import { useEffect, useRef, type InputHTMLAttributes } from "react";
import {
  clearAutocompleteListeners,
  isGoogleMapsConfigured,
  KENNETT_SQUARE_BOUNDS,
  loadPlacesLibrary,
  type PlacesAutocomplete,
} from "@/lib/google-maps";

type AddressInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "type"
> & {
  /** When set, renders the same labeled style as the shared Input component. */
  label?: string;
  value: string;
  onAddressChange: (address: string) => void;
};

/**
 * Address input that upgrades to Google Places autocomplete (biased to the
 * Kennett Square area) when NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set. Without
 * the key it behaves exactly like a plain text input.
 */
export function AddressInput({
  label,
  id,
  className = "",
  value,
  onAddressChange,
  ...props
}: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onAddressChangeRef = useRef(onAddressChange);

  useEffect(() => {
    onAddressChangeRef.current = onAddressChange;
  }, [onAddressChange]);

  useEffect(() => {
    if (!isGoogleMapsConfigured()) return;
    let cancelled = false;
    let autocomplete: PlacesAutocomplete | null = null;

    void loadPlacesLibrary().then((places) => {
      if (cancelled || !places || !inputRef.current) return;
      autocomplete = new places.Autocomplete(inputRef.current, {
        bounds: KENNETT_SQUARE_BOUNDS,
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
        types: ["address"],
      });
      autocomplete.addListener("place_changed", () => {
        const address = autocomplete?.getPlace().formatted_address;
        if (address) onAddressChangeRef.current(address);
      });
    });

    return () => {
      cancelled = true;
      if (autocomplete) clearAutocompleteListeners(autocomplete);
    };
  }, []);

  if (label) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <label htmlFor={inputId} className="block space-y-1.5">
        <span className="text-sm font-medium text-eat-ink">{label}</span>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onAddressChange(e.target.value)}
          className={`w-full rounded-xl border border-eat-border bg-white px-4 py-3 text-sm text-eat-ink outline-none transition focus:border-eat-blue focus:ring-2 focus:ring-eat-blue/20 ${className}`}
          {...props}
        />
      </label>
    );
  }

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={(e) => onAddressChange(e.target.value)}
      className={className}
      {...props}
    />
  );
}
