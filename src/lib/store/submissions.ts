import type { EarlyAccessSubmission } from "@/lib/types";
import { readJsonFile, writeJsonFile } from "./file-store";

// Swap to Supabase: await supabase.from('early_access').insert(submission)

const SUBMISSIONS_FILE = "submissions.json";

export async function getSubmissions(): Promise<EarlyAccessSubmission[]> {
  return readJsonFile<EarlyAccessSubmission[]>(SUBMISSIONS_FILE, []);
}

export async function saveSubmission(
  submission: EarlyAccessSubmission
): Promise<EarlyAccessSubmission> {
  const existing = await getSubmissions();
  existing.unshift(submission);
  await writeJsonFile(SUBMISSIONS_FILE, existing.slice(0, 1000));
  return submission;
}
