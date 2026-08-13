import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Coerce a "" | number-ish string to Int | null for DB columns.
function toInt(v: unknown): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function toDecimal(v: unknown): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
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

  const editToken = randomBytes(24).toString("base64url");

  try {
    const report = await prisma.report.create({
      data: {
        editToken,

        submitterName: String(data.submitter?.name ?? session?.user?.name ?? ""),
        submitterRole: String(data.submitter?.role ?? ""),
        // Source of truth: the verified Google session email, never the client payload.
        submitterEmail: sessionEmail,
        submitterPhone: data.submitter?.phone || null,

        schoolName: String(data.overview?.schoolName ?? ""),
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
        community: toInt(data.participation?.community),
        totalParticipants: toInt(data.participation?.total),
        schoolPopulation: toInt(data.participation?.schoolPopulation),
        participationRate: toDecimal(data.participation?.rate),

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

        documentationLinks: data.documentationLinks || null,
      },
      select: { id: true, editToken: true },
    });

    return NextResponse.json({ success: true, reportId: report.id, editToken: report.editToken });
  } catch (err) {
    console.error("Failed to save report:", err);
    return NextResponse.json({ error: "Failed to save report." }, { status: 500 });
  }
}
