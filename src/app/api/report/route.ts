import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cloudinaryConfig, isOwnDeliveryUrl } from "@/lib/cloudinary";
import { MAX_FILES, type UploadedFile } from "@/lib/uploads";
import { countryForSchool } from "@/lib/schoolCountry";
import { currencyForCountry, isCurrencyCode } from "@/data/currencies";
import { sendReportConfirmation } from "@/lib/mail";
import { TERMS_VERSION } from "@/lib/terms";

// Coerce a "" | number-ish string to Int | null for DB columns.
function toInt(v: unknown): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function toDate(v: unknown): Date | null {
  if (typeof v !== "string" || v === "") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function pickedKeys(obj: unknown): string[] {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj as Record<string, boolean>)
    .filter(([, v]) => v === true)
    .map(([k]) => k);
}

// Keep only well-formed attachments that point at our own Cloudinary cloud.
// The client owns this payload, so an unvalidated array would let a tampered
// request park an arbitrary URL on a report and have the site render it as
// official documentation.
function sanitizeFiles(input: unknown): UploadedFile[] {
  if (!Array.isArray(input)) return [];

  let cloudName: string;
  try {
    cloudName = cloudinaryConfig().cloudName;
  } catch {
    return [];
  }

  return input
    .filter((f): f is Record<string, unknown> => !!f && typeof f === "object")
    .filter((f) => typeof f.url === "string" && isOwnDeliveryUrl(f.url, cloudName))
    .slice(0, MAX_FILES)
    .map((f) => ({
      url: String(f.url),
      publicId: String(f.publicId ?? ""),
      resourceType: f.resourceType === "raw" ? ("raw" as const) : ("image" as const),
      name: String(f.name ?? "attachment"),
      bytes: Number(f.bytes) || 0,
      format: String(f.format ?? ""),
    }));
}

export async function POST(req: NextRequest) {
  // Require a signed-in Google user; anti-spam guarantee.
  const session = await auth();
  const sessionEmail = session?.user?.email?.toLowerCase();
  if (!sessionEmail) {
    return NextResponse.json(
      { error: "You must be signed in with Google to submit a report." },
      { status: 401 }
    );
  }

  const data = await req.json();

  if (!data?.overview?.schoolName || !data?.overview?.projectTitle) {
    return NextResponse.json(
      { error: "School name and project title are required." },
      { status: 400 }
    );
  }

  // Enforced here, not just in the UI. A record that the terms were accepted is
  // only worth something if it cannot be bypassed by posting straight to the
  // API. The version check also catches a stale tab left open across an update.
  if (data.termsAccepted !== true) {
    return NextResponse.json(
      { error: "Please accept the Report Submission Terms before submitting." },
      { status: 400 }
    );
  }
  if (data.termsVersion !== TERMS_VERSION) {
    return NextResponse.json(
      { error: "The submission terms have been updated. Please reload the page and review them." },
      { status: 409 }
    );
  }

  const editToken = randomBytes(24).toString("base64url");

  const schoolName = String(data.overview?.schoolName ?? "").trim();
  const country = countryForSchool(schoolName);

  try {
    const report = await prisma.report.create({
      data: {
        editToken,

        submitterName: String(data.submitter?.name ?? session?.user?.name ?? ""),
        submitterRole: String(data.submitter?.role ?? ""),
        // Source of truth: the verified Google session email, never the client payload.
        submitterEmail: sessionEmail,
        submitterPhone: data.submitter?.phone || null,

        schoolName,
        // Resolved server-side: the client can't be trusted to label a sector,
        // and this is what the district map and rollups group by.
        country,
        // Fall back to the sector's default so a submitter who never touched
        // the picker still gets their amounts labelled correctly.
        currency: isCurrencyCode(data.currency) ? data.currency : currencyForCountry(country),

        projectTitle: String(data.overview?.projectTitle ?? ""),
        description: data.overview?.description || null,
        dateImplemented: toDate(data.overview?.dateImplemented),
        projectDuration: data.overview?.projectDuration || null,
        targetParticipants: data.overview?.targetParticipants || null,
        projectLead: data.overview?.projectLead || null,

        initiativeTypes: pickedKeys(data.overview?.initiativeTypes),
        initiativeOther: data.overview?.initiativeOther || null,
        sdgGoals: pickedKeys(data.overview?.sdgGoals),

        students: toInt(data.participation?.students),
        faculty: toInt(data.participation?.faculty),
        staffAdmin: toInt(data.participation?.staffAdmin),
        totalParticipants: toInt(data.participation?.total),

        // Store impact as JSON; the shape mirrors the form so admin can render it back.
        impact: data.impact ?? {},

        // Effectiveness stored as-is (array of {criteria, rating, remarks})
        effectiveness: data.effectiveness ?? [],

        digitalPlatforms: pickedKeys(data.digitalAdvocacy?.platforms),
        digitalPlatformOther: data.digitalAdvocacy?.platformOther || null,
        hashtagUsed: data.digitalAdvocacy?.hashtagUsed || null,
        hashtagEffectiveness: data.digitalAdvocacy?.hashtagEffectiveness || null,
        reachReactions: toInt(data.digitalAdvocacy?.reach?.reactions),
        reachComments: toInt(data.digitalAdvocacy?.reach?.comments),
        reachShares: toInt(data.digitalAdvocacy?.reach?.shares),
        reachViews: toInt(data.digitalAdvocacy?.reach?.views),
        postLinks: data.digitalAdvocacy?.postLinks || null,

        termsAcceptedAt: new Date(),
        termsVersion: TERMS_VERSION,

        documentationLinks: data.documentationLinks || null,
        documentationFiles: sanitizeFiles(data.documentationFiles),
      },
      select: { id: true, editToken: true },
    });

    const origin = req.nextUrl.origin;
    const reflectUrl = `${origin}/report/${report.id}/reflect?token=${report.editToken}`;

    // Awaited, not fire-and-forget: a serverless function can be frozen the
    // moment it responds, which would drop an un-awaited send. sendMail
    // swallows its own errors, so this cannot fail the submission.
    const emailed = await sendReportConfirmation({
      to: sessionEmail,
      submitterName: String(data.submitter?.name ?? session?.user?.name ?? ""),
      schoolName,
      projectTitle: String(data.overview?.projectTitle ?? ""),
      reflectUrl,
      reportUrl: `${origin}/reports/${report.id}`,
    });

    return NextResponse.json({
      success: true,
      reportId: report.id,
      editToken: report.editToken,
      reflectUrl,
      // Lets the success screen tell the truth about whether mail actually went.
      emailed,
    });
  } catch (err) {
    console.error("Failed to save report:", err);
    return NextResponse.json({ error: "Failed to save report." }, { status: 500 });
  }
}
