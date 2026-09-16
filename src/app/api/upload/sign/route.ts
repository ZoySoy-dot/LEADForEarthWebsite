import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinaryConfig, signParams } from "@/lib/cloudinary";
import {
  MAX_FILE_BYTES,
  formatBytes,
  isAllowedExt,
  resourceTypeFor,
  uploadFolder,
  uploadPublicId,
  uploadTags,
} from "@/lib/uploads";
import { countryForSchool } from "@/lib/schoolCountry";

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

  const { filename, bytes, schoolName } = (await req.json()) as {
    filename?: unknown;
    bytes?: unknown;
    schoolName?: unknown;
  };

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

  // The path is built here, not by the client, and then signed. Cloudinary
  // rejects any upload whose params do not match the signature, so a caller
  // cannot redirect files into a folder of its choosing.
  const school = typeof schoolName === "string" ? schoolName.trim() : "";
  const yearMonth = new Date().toISOString().slice(0, 7);
  const sector = countryForSchool(school);
  const resourceType = resourceTypeFor(filename);

  const timestamp = Math.round(Date.now() / 1000);
  const folder = uploadFolder({ yearMonth, sector, schoolName: school });
  const publicId = uploadPublicId(filename, resourceType);
  const tags = uploadTags({ yearMonth, sector, schoolName: school });

  // Cloudinary signs public_id without the folder prefix when folder is sent
  // as its own param, so both travel separately and both are signed.
  const params = { folder, public_id: publicId, tags, timestamp };

  return NextResponse.json({
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    signature: signParams(params, config.apiSecret),
    timestamp,
    folder,
    publicId,
    tags,
    resourceType,
  });
}
