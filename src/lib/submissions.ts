import type { EarlyAccessSubmission } from "@/lib/types";

// TODO: Replace with Supabase insert when configured
// Example: await supabase.from('early_access').insert(submission)

const STORAGE_KEY = "eat76-early-access";

export function saveSubmission(submission: EarlyAccessSubmission) {
  if (typeof window === "undefined") return;

  const existing = getSubmissions();
  existing.push(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getSubmissions(): EarlyAccessSubmission[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EarlyAccessSubmission[]) : [];
  } catch {
    return [];
  }
}
