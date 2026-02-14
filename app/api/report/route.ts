import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/services/authz";
import { reportSchema } from "@/lib/validation/schemas";
import { prisma } from "@/lib/db/prisma";
import { errorResponse, parseJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const payload = await parseJson(req, reportSchema);
    const report = await prisma.report.create({
      data: {
        reporterId: user.id,
        postId: payload.postId,
        targetUserId: payload.userId,
        reason: payload.reason,
      },
    });
    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
