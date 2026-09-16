import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinaryConfig, signParams } from "@/lib/cloudinary";
import {
  MAX_FILE_BYTES,
  UPLOAD_FOLDER,
  UPLOAD_TAG,
  formatBytes,
  isAllowedExt,
  resourceTypeFor,
} from "@/lib/uploads";

// Hands the browser a short-lived, single-use signature so it can POST the file
// straight to Cloudinary. The bytes never pass through this route: Vercel caps
// request bodies around 4.5 MB and a single phone photo can exceed that.
//
// Signing server-side (rather than using an unsigned upload preset) means the
// upload target can't be lifted out of devtools and used to fill our account.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "You must be signed in with Google to upload files." },
      { status: 401 }
    );
  }

  const { filename, bytes } = (await req.json()) as { filename?: unknown; bytes?: unknown };

  if (typeof filename !== "string" || !filename.trim()) {
    return NextResponse.json({ error: "Missing filename." }, { status: 400 });
  }
  if (!isAllowedExt(filename)) {
    return NextResponse.json(
      { error: "That file type isn't supported. Use an image, PDF, or Office document." },
      { status: 400 }
    );
  }
  if (typeof bytes !== "number" || !Number.isFinite(bytes) || bytes <= 0) {
    return NextResponse.json({ error: "Missing file size." }, { status: 400 });
  }
  if (bytes > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: `That file is too large. The limit is ${formatBytes(MAX_FILE_BYTES)} per file.` },
      { status: 400 }
    );
  }

  let config;
  try {
    config = cloudinaryConfig();
  } catch (err) {
    console.error("Cloudinary config error:", err);
    return NextResponse.json(
      { error: "File uploads aren't configured yet. Please paste a link instead." },
      { status: 503 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  // Only these params are signed, so these are the only ones Cloudinary will
  // honour. A client that tries to smuggle in a different folder fails the
  // signature check on Cloudinary's side.
  const params = { folder: UPLOAD_FOLDER, tags: UPLOAD_TAG, timestamp };

  return NextResponse.json({
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    signature: signParams(params, config.apiSecret),
    timestamp,
    folder: UPLOAD_FOLDER,
    tags: UPLOAD_TAG,
    resourceType: resourceTypeFor(filename),
  });
}
