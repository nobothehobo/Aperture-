import { NextRequest, NextResponse } from "next/server";
import { commentSchema } from "@/lib/validation/schemas";
import { requireUser } from "@/server/services/authz";
import { createComment } from "@/server/services/social-service";
import { errorResponse, parseJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    const me = await requireUser();
    const { postId, body } = await parseJson(req, commentSchema);
    const comment = await createComment(me.id, postId, body);
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
