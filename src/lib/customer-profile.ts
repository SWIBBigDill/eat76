const PROFILE_KEY = "eat76-customer-profile";

export type CustomerProfile = {
  name: string;
  email: string;
  signedIn: boolean;
  signedInAt?: string;
};

export const DEFAULT_PROFILE: CustomerProfile = {
  name: "",
  email: "",
  signedIn: false,
};

export function loadCustomerProfile(): CustomerProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as CustomerProfile) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveCustomerProfile(profile: CustomerProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

export function signInWithEmail(email: string, name?: string): CustomerProfile {
  const profile: CustomerProfile = {
    name: name?.trim() || email.split("@")[0] || "Guest",
    email: email.trim().toLowerCase(),
    signedIn: true,
    signedInAt: new Date().toISOString(),
  };
  saveCustomerProfile(profile);
  return profile;
}

export function signOutCustomer(): CustomerProfile {
  const profile = DEFAULT_PROFILE;
  saveCustomerProfile(profile);
  return profile;
}

/** Demo magic link flow. TODO: Replace with Supabase Auth magic link when auth ships. */
export function requestMagicLink(email: string): { sent: boolean; message: string } {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { sent: false, message: "Enter a valid email address" };
  }
  signInWithEmail(trimmed);
  return {
    sent: true,
    message: "Demo sign-in complete. Your profile is saved on this device.",
  };
}
