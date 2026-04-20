import { NextRequest, NextResponse } from "next/server";

import { analyzeWithGemini } from "@/lib/ai/gemini";
import { requireAuthUser } from "@/lib/auth";
import { badRequestResponse, internalErrorResponse, unauthorizedResponse } from "@/lib/http";
import { analyzeRequestSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    await requireAuthUser();
  } catch {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const parsed = analyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const field = firstIssue?.path?.join(".") || "request";
      const message = firstIssue
        ? `Invalid ${field}: ${firstIssue.message}`
        : "Invalid request payload for analysis";
      return badRequestResponse(message);
    }

    const analysis = await analyzeWithGemini(parsed.data.item, parsed.data.language, parsed.data.imageDataUrl);

    return NextResponse.json({ analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return internalErrorResponse(message);
  }
}
