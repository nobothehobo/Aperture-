import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { profileQuerySchema } from "@/lib/validation/schemas";
import { errorResponse } from "@/lib/http";

export async function GET(req: NextRequest) {
  try {
    const parsed = profileQuerySchema.parse({
      username: req.nextUrl.searchParams.get("username"),
      cursor: req.nextUrl.searchParams.get("cursor") ?? undefined,
      limit: req.nextUrl.searchParams.get("limit") ?? undefined,
    });

    const posts = await prisma.post.findMany({
      where: { author: { username: parsed.username } },
      include: { media: true, likes: true, comments: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: parsed.limit + 1,
      ...(parsed.cursor ? { cursor: { id: parsed.cursor }, skip: 1 } : {}),
    });

    const hasMore = posts.length > parsed.limit;
    const items = hasMore ? posts.slice(0, parsed.limit) : posts;

    return NextResponse.json({ items, nextCursor: hasMore ? items[items.length - 1]?.id : null });
  } catch (error) {
    return errorResponse(error);
  }
}
