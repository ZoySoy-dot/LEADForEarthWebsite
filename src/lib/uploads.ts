// Shared upload rules for report documentation files.
//
// This module is imported by BOTH the browser (FileUpload) and the server
// (the signature route), so it must stay free of `crypto`, `fs`, and anything
// that reads process.env. Server-only signing lives in `./cloudinary`.

// --- Limits. Change these in one place and the UI + server both follow. ---
export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file
export const MAX_TOTAL_BYTES = 40 * 1024 * 1024; // 40 MB per report

// Root of the Cloudinary media library tree. Everything the site uploads lives
// under this prefix, which is also what the delete route checks against.
export const UPLOAD_FOLDER = "leadforearth/reports";
export const UPLOAD_TAG = "report-documentation";

// Turn arbitrary text into a path- and tag-safe slug.
// Falls back rather than returning "", which matters for scripts in Japanese,
// Thai or Burmese where every character can be stripped.
export function slugify(value: string, fallback = "file", max = 60): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/, "");
  return slug || fallback;
}

/**
 * Folder for one upload: leadforearth/reports/YYYY-MM/sector/school
 *
 * The hierarchy mirrors how the district actually looks things up: by campaign
 * month first, then sector, then institution. A flat folder of opaque ids is
 * unusable once a few hundred files exist, and Cloudinary's media library
 * browses by folder.
 */
export function uploadFolder(opts: {
  yearMonth: string;
  sector: string | null;
  schoolName: string;
}): string {
  const sector = slugify(opts.sector ?? "unlisted-sector", "unlisted-sector");
  const school = slugify(opts.schoolName, "unnamed-school");
  return `${UPLOAD_FOLDER}/${opts.yearMonth}/${sector}/${school}`;
}

/**
 * Public id for one upload, keeping the submitter's own filename readable.
 *
 * A short random suffix keeps two "photo 1.jpg" uploads from colliding without
 * making the name unreadable. Raw assets carry their extension in the public id
 * because Cloudinary serves them verbatim; images do not, since the format is
 * appended on delivery.
 */
export function uploadPublicId(filename: string, resourceType: ResourceType): string {
  const ext = extOf(filename);
  const base = filename.slice(0, filename.length - (ext ? ext.length + 1 : 0));
  const suffix = Math.random().toString(36).slice(2, 8);
  const stem = `${slugify(base)}-${suffix}`;
  return resourceType === "raw" && ext ? `${stem}.${ext}` : stem;
}

// Tags make the same files findable in Cloudinary's search when folder
// browsing is the wrong tool ("every clean-up photo from Japan", say).
export function uploadTags(opts: {
  yearMonth: string;
  sector: string | null;
  schoolName: string;
}): string {
  return [
    UPLOAD_TAG,
    opts.yearMonth,
    `sector-${slugify(opts.sector ?? "unlisted", "unlisted")}`,
    `school-${slugify(opts.schoolName, "unnamed")}`,
  ].join(",");
}

// Images go through Cloudinary's `image` pipeline, which gives us automatic
// compression and on-the-fly thumbnails. Everything else is delivered as `raw`,
// i.e. the original bytes untouched. Raw also sidesteps the "PDF and ZIP
// delivery" account setting, which is OFF by default on new Cloudinary accounts
// and would otherwise make uploaded PDFs 401 on download.
export const IMAGE_EXTS: string[] = ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif", "avif"];
export const DOC_EXTS: string[] = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv", "txt"];
export const ALLOWED_EXTS: string[] = [...IMAGE_EXTS, ...DOC_EXTS];

// For the file picker's `accept` attribute.
export const ACCEPT_ATTR = ALLOWED_EXTS.map((e) => `.${e}`).join(",");

export type ResourceType = "image" | "raw";

// One uploaded file as stored on the report row (reports.documentation_files).
export type UploadedFile = {
  url: string;
  publicId: string;
  resourceType: ResourceType;
  name: string;
  bytes: number;
  format: string;
};

export function extOf(filename: string): string {
  const i = filename.lastIndexOf(".");
  return i === -1 ? "" : filename.slice(i + 1).toLowerCase();
}

export function isAllowedExt(filename: string): boolean {
  return ALLOWED_EXTS.includes(extOf(filename));
}

export function isImageFile(filename: string): boolean {
  return IMAGE_EXTS.includes(extOf(filename));
}

export function resourceTypeFor(filename: string): ResourceType {
  return isImageFile(filename) ? "image" : "raw";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Build a square thumbnail URL by injecting a transform after `/upload/`.
// Only meaningful for resourceType "image"; raw files have no transforms.
export function thumbUrl(url: string, size = 200): string {
  return url.replace("/upload/", `/upload/c_fill,g_auto,w_${size},h_${size},q_auto,f_auto/`);
}

// Coerce a Prisma Json column back into typed attachments. Reports created
// before this column existed default to [], but a hand-edited row could hold
// anything, so this stays defensive rather than casting.
export function filesFrom(value: unknown): UploadedFile[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (f): f is UploadedFile =>
      !!f && typeof f === "object" && typeof (f as UploadedFile).url === "string"
  );
}

// Full-size delivery URL for an image. The f_auto matters more than it looks:
// iPhones upload HEIC by default and most browsers cannot render a raw .heic,
// so linking the original file would give the viewer a download prompt instead
// of a photo. Cloudinary transcodes on delivery. Raw files have no transforms,
// so they are returned untouched.
export function viewUrl(file: UploadedFile): string {
  if (file.resourceType !== "image") return file.url;
  return file.url.replace("/upload/", "/upload/q_auto,f_auto/");
}
