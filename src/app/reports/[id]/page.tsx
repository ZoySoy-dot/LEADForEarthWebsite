import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PublicReport from "@/components/PublicReport";
import SkipLink from "@/components/SkipLink";
import { LEAD_SCHOOLS_BY_COUNTRY, LEGACY_SCHOOL_ALIASES } from "@/data/schools";
import { buildDistrictMapData } from "@/lib/districtMapData";
import { prisma } from "@/lib/prisma";

// Lowercased-schoolName → country lookup (mirrors the community page's).
// Includes legacy aliases so older seeded reports still map correctly.
const SCHOOL_TO_COUNTRY = (() => {
  const map = new Map<string, string>();
  for (const [country, names] of Object.entries(LEAD_SCHOOLS_BY_COUNTRY)) {
    for (const n of names) map.set(n.toLowerCase(), country);
  }
  for (const [legacy, canonical] of Object.entries(LEGACY_SCHOOL_ALIASES)) {
    const country = map.get(canonical.toLowerCase());
    if (country) map.set(legacy, country);
  }
  return map;
})();

export const revalidate = 300;

// Basic UUID shape check so junk paths short-circuit to 404 before hitting the DB.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_RE.test(id)) return { title: "Report not found | LEADForEarth" };
  const report = await prisma.report.findFirst({
    where: { id, status: "approved" },
    select: { schoolName: true, projectTitle: true, description: true },
  });
  if (!report) return { title: "Report not found | LEADForEarth" };
  return {
    title: `${report.projectTitle} · ${report.schoolName} | LEADForEarth`,
    description:
      report.description?.slice(0, 160) ??
      `A #LEADforEarth report from ${report.schoolName}.`,
  };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const report = await prisma.report.findFirst({
    where: { id, status: "approved" },
    include: { reflection: true },
  });
  if (!report) notFound();

  const rawSchoolName = report.schoolName.trim();
  const rawSchoolKey = rawSchoolName.toLowerCase();
  const country = SCHOOL_TO_COUNTRY.get(rawSchoolKey) ?? null;
  // Resolve any legacy spelling to the canonical school name so we can find
  // the school's coordinates in the projected map data.
  const canonicalSchoolName = LEGACY_SCHOOL_ALIASES[rawSchoolKey] ?? rawSchoolName;

  // Country outline + reporting-school pin for the page background. Built from
  // the same projected topojson the district map uses so shapes and stars sit
  // in the same coordinate space.
  const countryOutline = (() => {
    if (!country) return null;
    const mapData = buildDistrictMapData();
    const match = mapData.countries.find((c) => c.leadCountry === country);
    if (!match || !match.bbox) return null;
    const schoolMatch = mapData.schools.find(
      (s) =>
        s.country === country &&
        s.name.toLowerCase() === canonicalSchoolName.toLowerCase(),
    );
    return {
      d: match.d,
      bbox: match.bbox,
      schoolPoint: schoolMatch ? { x: schoolMatch.x, y: schoolMatch.y } : null,
    };
  })();

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
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <Link
            href="/community"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:opacity-70"
            style={{ color: "var(--brand-mid)" }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to community
          </Link>
        </div>
        <PublicReport report={report} country={country} countryOutline={countryOutline} />
      </main>
      <Footer />
    </>
  );
}
