import { z } from "zod";

const cleanString = z.string().trim();

export const usernameSchema = cleanString
  .min(3)
  .max(30)
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only include letters, numbers, and underscores")
  .transform((value) => value.toLowerCase());

export const createPostSchema = z.object({
  caption: cleanString.min(1).max(2200),
  imageUrl: cleanString.url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  placeholder: cleanString.max(200).optional(),
  camera: cleanString.max(120).optional(),
  lens: cleanString.max(120).optional(),
  settings: cleanString.max(300).optional(),
  tags: z.array(cleanString.regex(/^#[a-zA-Z0-9_-]{2,32}$/)).max(10).default([]),
});

export const paginationSchema = z.object({
  cursor: cleanString.optional(),
  limit: z.coerce.number().int().min(1).max(30).default(10),
});

export const followSchema = z.object({
  userId: cleanString.uuid(),
});

export const likeSchema = z.object({
  postId: cleanString.uuid(),
});

export const commentSchema = z.object({
  postId: cleanString.uuid(),
  body: cleanString.min(1).max(500),
});

export const profileQuerySchema = z.object({
  username: usernameSchema,
  cursor: cleanString.optional(),
  limit: z.coerce.number().int().min(1).max(30).default(12),
});

export const tagSchema = z.object({
  tag: cleanString.regex(/^#[a-zA-Z0-9_-]{2,32}$/),
  cursor: cleanString.optional(),
  limit: z.coerce.number().int().min(1).max(30).default(12),
});

export const reportSchema = z.object({
  postId: cleanString.uuid().optional(),
  userId: cleanString.uuid().optional(),
  reason: cleanString.min(5).max(280),
}).refine((val) => !!val.postId || !!val.userId, {
  message: "Either postId or userId is required",
});

export const uploadSchema = z.object({
  fileName: cleanString.min(3),
  contentType: cleanString,
  fileSize: z.number().int().positive().max(10 * 1024 * 1024),
}).refine(({ contentType }) => ["image/jpeg", "image/png", "image/webp"].includes(contentType), {
  message: "Unsupported image type",
  path: ["contentType"],
});
