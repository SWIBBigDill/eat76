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

/**
 * Magic link sign-in. Uses Supabase Auth when configured; otherwise falls
 * back to a device-local demo profile.
 */
export async function requestMagicLink(
  email: string
): Promise<{ sent: boolean; message: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { sent: false, message: "Enter a valid email address" };
  }

  const { getSupabaseBrowser } = await import("@/lib/supabase/client");
  const supabase = getSupabaseBrowser();
  if (supabase) {
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
    if (error) {
      return { sent: false, message: `Could not send sign-in link: ${error.message}` };
    }
    return {
      sent: true,
      message: "Check your email for a sign-in link.",
    };
  }

  signInWithEmail(trimmed);
  return {
    sent: true,
    message: "Demo sign-in complete. Your profile is saved on this device.",
  };
}

/**
 * Pulls the signed-in Supabase user (if any) into the local profile so the
 * rest of the app keeps working off CustomerProfile.
 */
export async function syncProfileFromSupabase(): Promise<CustomerProfile | null> {
  const { getSupabaseBrowser } = await import("@/lib/supabase/client");
  const supabase = getSupabaseBrowser();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user?.email) return null;
  const profile: CustomerProfile = {
    name:
      (user.user_metadata?.full_name as string | undefined) ??
      user.email.split("@")[0],
    email: user.email,
    signedIn: true,
    signedInAt: user.last_sign_in_at ?? new Date().toISOString(),
  };
  saveCustomerProfile(profile);
  return profile;
}

export async function signOutEverywhere(): Promise<CustomerProfile> {
  const { getSupabaseBrowser } = await import("@/lib/supabase/client");
  const supabase = getSupabaseBrowser();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return signOutCustomer();
}
