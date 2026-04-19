import { NextResponse } from "next/server";

import { requireAuthUser } from "@/lib/auth";
import { getStats } from "@/lib/db/repository";
import { internalErrorResponse, unauthorizedResponse } from "@/lib/http";

export async function GET() {
  let user;

  try {
    user = await requireAuthUser();
  } catch {
    return unauthorizedResponse();
  }

  try {
    const stats = await getStats(user);

    return NextResponse.json({ stats });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load stats";
    return internalErrorResponse(message);
  }
}
