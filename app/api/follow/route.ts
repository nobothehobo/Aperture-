import { NextRequest, NextResponse } from "next/server";
import { followSchema } from "@/lib/validation/schemas";
import { requireUser } from "@/server/services/authz";
import { followUser, unfollowUser } from "@/server/services/social-service";
import { errorResponse, parseJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    const me = await requireUser();
    const { userId } = await parseJson(req, followSchema);
    const follow = await followUser(me.id, userId);
    return NextResponse.json({ follow }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const me = await requireUser();
    const { userId } = await parseJson(req, followSchema);
    await unfollowUser(me.id, userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
