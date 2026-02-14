import { describe, expect, it, vi } from "vitest";

const findMany = vi.fn();
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    post: { findMany },
  },
}));

import { listFeedForUser } from "@/server/queries/feed";

describe("listFeedForUser", () => {
  it("builds chronological query for user + follows", async () => {
    findMany.mockResolvedValueOnce([]);
    await listFeedForUser("user-1", undefined, 10);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: "desc" },
        take: 11,
        where: {
          OR: [
            { authorId: "user-1" },
            { author: { followers: { some: { followerId: "user-1" } } } },
          ],
        },
      }),
    );
  });
});
