import { getSupabaseServer } from "@/lib/supabase/server";
import type { EarlyAccessSubmission } from "@/lib/types";
import { readJsonFile, writeJsonFile } from "./file-store";

const SUBMISSIONS_FILE = "submissions.json";

export async function getSubmissions(): Promise<EarlyAccessSubmission[]> {
  const supabase = getSupabaseServer();
  if (supabase) {
    const { data, error } = await supabase
      .from("early_access")
      .select("payload")
      .order("submitted_at", { ascending: false })
      .limit(1000);
    if (!error && Array.isArray(data)) {
      return data.map((r) => r.payload as EarlyAccessSubmission);
    }
    // Anon key has insert-only access; counting reads fall through to file.
  }
  return readJsonFile<EarlyAccessSubmission[]>(SUBMISSIONS_FILE, []);
}

export async function saveSubmission(
  submission: EarlyAccessSubmission
): Promise<EarlyAccessSubmission> {
  const supabase = getSupabaseServer();
  if (supabase) {
    const { error } = await supabase.from("early_access").insert({
      type: submission.type,
      payload: submission,
      submitted_at: submission.submittedAt,
    });
    if (!error) return submission;
    console.error("[early-access] insert failed:", error.message);
  }
  const existing = await readJsonFile<EarlyAccessSubmission[]>(
    SUBMISSIONS_FILE,
    []
  );
  existing.unshift(submission);
  await writeJsonFile(SUBMISSIONS_FILE, existing.slice(0, 1000));
  return submission;
}
