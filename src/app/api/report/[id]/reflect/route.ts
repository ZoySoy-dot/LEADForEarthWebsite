import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

// Constant-time string compare. The token is a bearer credential, so a plain
// === would leak its prefix through response timing.
function tokensMatch(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function str(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

// Only these three are meaningful to the schema's `continuing` field.
function continuing(v: unknown): string | null {
  return v === "Yes" || v === "NotYet" || v === "No" ? v : null;
}

/**
 * Files the optional reflection for a report.
 *
 * Deliberately NOT behind Google sign-in. The submitter may come back weeks
 * later, on another device, or the report may have been filed from a shared
 * department account. The edit token in the emailed link is the credential.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const report = await prisma.report.findUnique({
    where: { id },
    select: { id: true, editToken: true },
  });

  // Same response for "no such report" and "wrong token" so this can't be used
  // to probe which report ids exist.
  if (!report || !tokensMatch(token, report.editToken)) {
    return NextResponse.json({ error: "This link isn't valid." }, { status: 403 });
  }

  const data = await req.json();

  const fields = {
    climateIncluded: str(data.climateLiteracy?.included),
    climateDescription: str(data.climateLiteracy?.description),
    participantFeedback: str(data.participantFeedback),
    spiritOfFaith: str(data.lasallianReflection?.spiritOfFaith),
    zealForService: str(data.lasallianReflection?.zealForService),
    communionInMission: str(data.lasallianReflection?.communionInMission),
    whatWentWell: str(data.lessons?.whatWentWell),
    challenges: str(data.lessons?.challenges),
    recommendations: str(data.lessons?.recommendations),
    districtSuggestions: str(data.lessons?.districtSuggestions),
    continuing: continuing(data.lessons?.continuing),
    plannedActivity: str(data.lessons?.plannedActivity),
    notContinuingReason: str(data.lessons?.notContinuingReason),
  };

  try {
    // Upsert, not create: the link doesn't expire, so someone may come back to
    // revise what they wrote. hasReflections is the admin list's rollup flag.
    await prisma.$transaction([
      prisma.reflection.upsert({
        where: { reportId: id },
        create: { reportId: id, ...fields },
        update: fields,
      }),
      prisma.report.update({
        where: { id },
        data: { hasReflections: true },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save reflection:", err);
    return NextResponse.json({ error: "Failed to save your reflection." }, { status: 500 });
  }
}
