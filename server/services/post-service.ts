import { prisma } from "@/lib/db/prisma";
import { sanitizeText } from "@/lib/security/sanitize";
import { createPostSchema } from "@/lib/validation/schemas";

export async function createPost(input: unknown, userId: string) {
  const parsed = createPostSchema.parse(input);

  const tags = [...new Set(parsed.tags.map((tag) => tag.toLowerCase()))];

  return prisma.post.create({
    data: {
      authorId: userId,
      caption: sanitizeText(parsed.caption),
      camera: parsed.camera,
      lens: parsed.lens,
      settings: parsed.settings,
      media: {
        create: {
          url: parsed.imageUrl,
          width: parsed.width,
          height: parsed.height,
          placeholder: parsed.placeholder,
        },
      },
      tags: {
        create: tags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    },
    include: {
      media: true,
      tags: { include: { tag: true } },
    },
  });
}
