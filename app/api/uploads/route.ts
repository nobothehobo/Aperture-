import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/services/authz";
import { uploadSchema } from "@/lib/validation/schemas";
import { createPresignedUploadStub } from "@/lib/storage/s3";
import { errorResponse, parseJson } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    await requireUser();
    const payload = await parseJson(req, uploadSchema);
    const data = createPresignedUploadStub(payload.fileName);
    return NextResponse.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
