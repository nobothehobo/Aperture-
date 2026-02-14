import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { tagSchema } from "@/lib/validation/schemas";
import { errorResponse } from "@/lib/http";

export async function GET(req: NextRequest) {
  try {
    const parsed = tagSchema.parse({
      tag: req.nextUrl.searchParams.get("tag"),
      limit: req.nextUrl.searchParams.get("limit") ?? undefined,
    });

    const records = await prisma.postTag.findMany({
      where: { tag: { name: parsed.tag.toLowerCase() } },
      include: { post: { include: { author: true, media: true, tags: { include: { tag: true } } } } },
      orderBy: { post: { createdAt: "desc" } },
      take: parsed.limit,
    });

    return NextResponse.json({ items: records.map((record) => record.post) });
  } catch (error) {
    return errorResponse(error);
  }
}
