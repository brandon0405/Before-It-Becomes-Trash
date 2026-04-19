import { NextRequest, NextResponse } from "next/server";

import { requireAuthUser } from "@/lib/auth";
import { createRescueCase } from "@/lib/db/repository";
import { badRequestResponse, conflictResponse, internalErrorResponse, unauthorizedResponse } from "@/lib/http";
import { rescueCreateRequestSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  let user;

  try {
    user = await requireAuthUser();
  } catch {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const parsed = rescueCreateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return badRequestResponse("Invalid request payload for rescue creation");
    }

    const created = await createRescueCase({
      user,
      item: parsed.data.item,
      analysis: parsed.data.analysis,
      registerOnChain: parsed.data.registerOnChain,
    });

    return NextResponse.json({ rescue: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create rescue";

    if (message === "Duplicate rescue case") {
      return conflictResponse("This case was already saved.");
    }

    return internalErrorResponse(message);
  }
}
