"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/server/services/authz";
import { createPost } from "@/server/services/post-service";
import { createPostSchema } from "@/lib/validation/schemas";

export async function createPostAction(formData: FormData) {
  const user = await requireUser();

  const payload = createPostSchema.parse({
    caption: formData.get("caption"),
    imageUrl: formData.get("imageUrl"),
    width: Number(formData.get("width")),
    height: Number(formData.get("height")),
    placeholder: formData.get("placeholder") || undefined,
    camera: formData.get("camera") || undefined,
    lens: formData.get("lens") || undefined,
    settings: formData.get("settings") || undefined,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  });

  await createPost(payload, user.id);
  redirect("/feed");
}
