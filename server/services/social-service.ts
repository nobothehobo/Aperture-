import { prisma } from "@/lib/db/prisma";
import { sanitizeText } from "@/lib/security/sanitize";

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) throw new Error("BAD_REQUEST");
  return prisma.follow.upsert({
    where: { followerId_followingId: { followerId, followingId } },
    update: {},
    create: { followerId, followingId },
  });
}

export async function unfollowUser(followerId: string, followingId: string) {
  return prisma.follow.deleteMany({ where: { followerId, followingId } });
}

export async function likePost(userId: string, postId: string) {
  return prisma.like.upsert({
    where: { userId_postId: { userId, postId } },
    update: {},
    create: { userId, postId },
  });
}

export async function unlikePost(userId: string, postId: string) {
  return prisma.like.deleteMany({ where: { userId, postId } });
}

export async function createComment(userId: string, postId: string, body: string) {
  return prisma.comment.create({
    data: { userId, postId, body: sanitizeText(body) },
    include: { author: true },
  });
}
