import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { destroyAsset } from "@/lib/cloudinary";
import { UPLOAD_FOLDER } from "@/lib/uploads";

// Called when a submitter removes a file from the form before submitting, so
// abandoned uploads don't accumulate against the storage quota.
//
// Scope note: this authorises any signed-in user against any public_id inside
// our uploads folder, because at this point the file isn't attached to a report
// row yet, so there's no owner to check against. Cloudinary public_ids carry a
// random suffix, so they aren't enumerable. Deletes of files already saved on a
// submitted report are an admin action and don't go through here.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { publicId, resourceType } = (await req.json()) as {
    publicId?: unknown;
    resourceType?: unknown;
  };

  if (typeof publicId !== "string" || !publicId.startsWith(`${UPLOAD_FOLDER}/`)) {
    return NextResponse.json({ error: "Invalid file reference." }, { status: 400 });
  }
  const type = resourceType === "raw" ? "raw" : "image";

  try {
    const ok = await destroyAsset(publicId, type);
    return NextResponse.json({ success: ok });
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
    // The file is dropped from the form either way; a leftover asset is not
    // worth blocking the submitter over.
    return NextResponse.json({ success: false });
  }
}
