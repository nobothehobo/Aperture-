"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/server/services/authz";
import { prisma } from "@/lib/db/prisma";
import { sanitizeText } from "@/lib/security/sanitize";
import { usernameSchema } from "@/lib/validation/schemas";

export async function completeOnboardingAction(formData: FormData) {
  const user = await requireUser();
  const username = usernameSchema.parse(formData.get("username"));

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing && existing.id !== user.id) throw new Error("Username already taken");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      username,
      displayName: sanitizeText(String(formData.get("displayName") ?? "")) || undefined,
      bio: sanitizeText(String(formData.get("bio") ?? "")) || undefined,
      location: sanitizeText(String(formData.get("location") ?? "")) || undefined,
      website: sanitizeText(String(formData.get("website") ?? "")) || undefined,
      gear: sanitizeText(String(formData.get("gear") ?? "")) || undefined,
    },
  });

  redirect(`/@${username}`);
}
