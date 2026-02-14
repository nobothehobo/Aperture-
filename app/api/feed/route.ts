import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/services/authz";
import { paginationSchema } from "@/lib/validation/schemas";
import { listFeedForUser } from "@/server/queries/feed";
import { errorResponse } from "@/lib/http";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const parsed = paginationSchema.parse({
      cursor: req.nextUrl.searchParams.get("cursor") ?? undefined,
      limit: req.nextUrl.searchParams.get("limit") ?? undefined,
    });

    const posts = await listFeedForUser(user.id, parsed.cursor, parsed.limit);
    const hasMore = posts.length > parsed.limit;
    const items = hasMore ? posts.slice(0, parsed.limit) : posts;

    return NextResponse.json({
      items,
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
