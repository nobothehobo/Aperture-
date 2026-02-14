import { describe, expect, it } from "vitest";
import { createPostSchema, usernameSchema, uploadSchema } from "@/lib/validation/schemas";

describe("validation schemas", () => {
  it("normalizes usernames", () => {
    expect(usernameSchema.parse("Photo_User")).toBe("photo_user");
  });

  it("validates create post payload", () => {
    const payload = createPostSchema.parse({
      caption: "Hello",
      imageUrl: "https://cdn.example.com/test.jpg",
      width: 3000,
      height: 2000,
      tags: ["#street"],
    });
    expect(payload.tags[0]).toBe("#street");
  });

  it("rejects oversized upload", () => {
    expect(() =>
      uploadSchema.parse({
        fileName: "photo.jpg",
        contentType: "image/jpeg",
        fileSize: 12 * 1024 * 1024,
      }),
    ).toThrow();
  });
});
