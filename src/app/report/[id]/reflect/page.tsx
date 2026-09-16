import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { timingSafeEqual } from "crypto";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SkipLink from "@/components/SkipLink";
import ReflectionForm, {
  EMPTY_REFLECTION,
  type ReflectionValues,
} from "@/components/ReflectionForm";
import { prisma } from "@/lib/prisma";

// The link is emailed and long-lived; keeping it out of search results matters
// more than indexing it.
export const metadata: Metadata = {
  title: "Add your reflection | LEADForEarth",
  robots: { index: false, follow: false },
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function tokensMatch(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function InvalidLink() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div
        className="rounded-3xl p-10 sm:p-14"
        style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-strong)" }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--text-heading)" }}>
          This link isn&apos;t valid.
        </h1>
        <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
          Reflection links come from the confirmation email sent when a report is filed. Check that
          you copied the whole link, including everything after <code>?token=</code>. If you still
          can&apos;t get in, reply to that email and the committee will send a fresh one.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
          style={{ backgroundColor: "var(--brand)", color: "var(--text-inverse)" }}
        >
          Back to LEADForEarth
        </Link>
      </div>
    </div>
  );
}

export default async function ReflectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!UUID_RE.test(id)) notFound();

  const report = await prisma.report.findUnique({
    where: { id },
    select: {
      id: true,
      editToken: true,
      schoolName: true,
      projectTitle: true,
      reflection: true,
    },
  });

  // One shared failure page for missing report and bad token, so this can't be
  // used to discover which report ids exist.
  const ok = Boolean(report && token && tokensMatch(token, report.editToken));

  return (
    <>
      <SkipLink />
      <Header />
      <main
        id="main"
        tabIndex={-1}
        className="pt-[68px] focus:outline-none"
        style={{ backgroundColor: "var(--surface-page)" }}
      >
        {!ok || !report ? (
          <InvalidLink />
        ) : (
          <ReflectionForm
            reportId={report.id}
            token={token!}
            projectTitle={report.projectTitle}
            schoolName={report.schoolName}
            alreadyFiled={Boolean(report.reflection)}
            initial={toValues(report.reflection)}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

// Prefill from an existing reflection so a revisit edits rather than restarts.
function toValues(r: {
  climateIncluded: string | null;
  climateDescription: string | null;
  participantFeedback: string | null;
  spiritOfFaith: string | null;
  zealForService: string | null;
  communionInMission: string | null;
  whatWentWell: string | null;
  challenges: string | null;
  recommendations: string | null;
  districtSuggestions: string | null;
  continuing: string | null;
  plannedActivity: string | null;
  notContinuingReason: string | null;
} | null): ReflectionValues {
  if (!r) return EMPTY_REFLECTION;
  return {
    climateLiteracy: {
      included: r.climateIncluded ?? "",
      description: r.climateDescription ?? "",
    },
    participantFeedback: r.participantFeedback ?? "",
    lasallianReflection: {
      spiritOfFaith: r.spiritOfFaith ?? "",
      zealForService: r.zealForService ?? "",
      communionInMission: r.communionInMission ?? "",
    },
    lessons: {
      whatWentWell: r.whatWentWell ?? "",
      challenges: r.challenges ?? "",
      recommendations: r.recommendations ?? "",
      districtSuggestions: r.districtSuggestions ?? "",
      continuing: r.continuing ?? "",
      plannedActivity: r.plannedActivity ?? "",
      notContinuingReason: r.notContinuingReason ?? "",
    },
  };
}
