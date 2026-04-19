import { NextResponse } from "next/server";

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function conflictResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 409 });
}

export function internalErrorResponse(message = "Unexpected server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}
