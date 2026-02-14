import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";

export async function parseJson<T>(req: NextRequest, schema: ZodSchema<T>) {
  const json = await req.json();
  return schema.parse(json);
}

export function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  if (message === "UNAUTHORIZED") return NextResponse.json({ error: message }, { status: 401 });
  if (message === "BAD_REQUEST") return NextResponse.json({ error: message }, { status: 400 });
  return NextResponse.json({ error: message }, { status: 400 });
}
