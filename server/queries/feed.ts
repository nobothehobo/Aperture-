import { prisma } from "@/lib/db/prisma";

export async function listFeedForUser(userId: string, cursor?: string, take = 10) {
  return prisma.post.findMany({
    where: {
      OR: [
        { authorId: userId },
        { author: { followers: { some: { followerId: userId } } } },
      ],
    },
    include: {
      author: true,
      media: true,
      likes: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
        take: 2,
      },
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
}
