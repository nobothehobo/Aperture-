import { NextRequest, NextResponse } from "next/server";
import { likeSchema } from "@/lib/validation/schemas";
import { requireUser } from "@/server/services/authz";
import { likePost, unlikePost } from "@/server/services/social-service";
import { errorResponse, parseJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    const me = await requireUser();
    const { postId } = await parseJson(req, likeSchema);
    const like = await likePost(me.id, postId);
    return NextResponse.json({ like }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const me = await requireUser();
    const { postId } = await parseJson(req, likeSchema);
    await unlikePost(me.id, postId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
