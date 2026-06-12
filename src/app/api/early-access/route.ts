import { NextResponse } from "next/server";
import { saveSubmission } from "@/lib/store/submissions";
import type { EarlyAccessSubmission } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: EarlyAccessSubmission;
  try {
    body = (await request.json()) as EarlyAccessSubmission;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.type || !body.submittedAt) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  try {
    const saved = await saveSubmission(body);
    return NextResponse.json({ ok: true, id: saved.submittedAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save submission.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { getSubmissions } = await import("@/lib/store/submissions");
    const submissions = await getSubmissions();
    return NextResponse.json({ count: submissions.length });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
