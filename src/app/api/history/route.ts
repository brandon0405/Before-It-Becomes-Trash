import { NextResponse } from "next/server";

import { requireAuthUser } from "@/lib/auth";
import { getHistory } from "@/lib/db/repository";
import { internalErrorResponse, unauthorizedResponse } from "@/lib/http";

export async function GET() {
  let user;

  try {
    user = await requireAuthUser();
  } catch {
    return unauthorizedResponse();
  }

  try {
    const history = await getHistory(user);

    return NextResponse.json({ history });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load history";
    return internalErrorResponse(message);
  }
}
