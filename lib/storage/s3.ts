import crypto from "crypto";

export function createPresignedUploadStub(fileName: string) {
  const fileKey = `${crypto.randomUUID()}-${fileName}`;
  return {
    fileKey,
    uploadUrl: `${process.env.S3_PUBLIC_BASE_URL ?? "https://example.invalid"}/upload/${fileKey}`,
    publicUrl: `${process.env.S3_PUBLIC_BASE_URL ?? "https://example.invalid"}/${fileKey}`,
  };
}
