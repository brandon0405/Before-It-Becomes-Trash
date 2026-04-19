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
      return badRequestResponse("Invalid request payload for analysis");
    }

    const analysis = await analyzeWithGemini(parsed.data.item, parsed.data.language, parsed.data.imageDataUrl);

    return NextResponse.json({ analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return internalErrorResponse(message);
  }
}
