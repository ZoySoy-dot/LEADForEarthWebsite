// Server-only Cloudinary helpers.
//
// We sign requests by hand rather than pulling in the `cloudinary` SDK: the
// whole protocol is "SHA-1 the sorted params plus your API secret", and keeping
// it dependency-free means nothing extra ships into the serverless bundle.
//
// Never import this from a client component; it reads the API secret.
import { createHash } from "crypto";
import type { ResourceType } from "./uploads";

export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export function cloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }
  return { cloudName, apiKey, apiSecret };
}

// Cloudinary's signature: sort the params by key, join as k=v&k=v, append the
// API secret, SHA-1 the result. `file`, `api_key`, `resource_type` and
// `cloud_name` are excluded by the spec, so they are never passed in here.
export function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

// Delete an asset. Used when a submitter removes a file from the form before
// submitting, so abandoned uploads do not pile up against the storage quota.
export async function destroyAsset(publicId: string, resourceType: ResourceType): Promise<boolean> {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = signParams({ public_id: publicId, timestamp }, apiSecret);

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
  });

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
    { method: "POST", body }
  );
  if (!res.ok) return false;
  const json = (await res.json()) as { result?: string };
  // "not found" means it is already gone, which is the outcome we wanted.
  return json.result === "ok" || json.result === "not found";
}

// A URL is only trusted if it is an https Cloudinary delivery URL for OUR cloud.
// Guards against a tampered payload storing an arbitrary link as an attachment.
export function isOwnDeliveryUrl(url: string, cloudName: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname === "res.cloudinary.com" &&
      u.pathname.startsWith(`/${cloudName}/`)
    );
  } catch {
    return false;
  }
}
