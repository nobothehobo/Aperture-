import { NextRequest, NextResponse } from "next/server";
import { createPost } from "@/server/services/post-service";
import { requireUser } from "@/server/services/authz";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createPostSchema } from "@/lib/validation/schemas";
import { errorResponse, parseJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const rate = checkRateLimit(`post:${user.id}`, 10, 60_000);
    if (!rate.allowed) return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });

    const payload = await parseJson(req, createPostSchema);
    const post = await createPost(payload, user.id);

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
