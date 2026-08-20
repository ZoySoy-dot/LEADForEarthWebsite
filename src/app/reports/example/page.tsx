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

// Marker email used to identify the seeded sample report so this route can
// always find it without needing to hardcode an ID that changes on re-seed.
const EXAMPLE_EMAIL = "example@leadforearth.org";

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

export const metadata: Metadata = {
  title: "See what your report looks like | LEADForEarth",
  description:
    "A sample #LEADforEarth report so institutions can preview how their own submission will appear once approved.",
};

export default async function ExampleReportPage() {
  const report = await prisma.report.findFirst({
    where: { submitterEmail: EXAMPLE_EMAIL },
    include: { reflection: true },
    orderBy: { createdAt: "desc" },
  });
  if (!report) notFound();

  const rawSchoolName = report.schoolName.trim();
  const rawSchoolKey = rawSchoolName.toLowerCase();
  const country = SCHOOL_TO_COUNTRY.get(rawSchoolKey) ?? null;
  const canonicalSchoolName = LEGACY_SCHOOL_ALIASES[rawSchoolKey] ?? rawSchoolName;

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
        {/* Explainer banner so visitors know this is a preview, not a real
            submission. Sits above the report so it reads first. */}
        <section
          className="px-6 pt-8 pb-2"
          style={{ backgroundColor: "var(--surface-page)" }}
        >
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8"
              style={{
                backgroundColor: "var(--surface-accent)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--brand)", color: "var(--text-inverse)" }}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-1"
                  style={{ color: "var(--brand-mid)" }}
                >
                  Sample Report
                </p>
                <h1
                  className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight"
                  style={{ color: "var(--text-heading)" }}
                >
                  This is what your report will look like.
                </h1>
                <p
                  className="mt-2 text-[14.5px] leading-relaxed"
                  style={{ color: "var(--text-body)" }}
                >
                  A fictional #LEADforEarth submission from a real Lasallian
                  school, filled in end-to-end so you can preview every section
                  before you start yours.
                </p>
              </div>

              <Link
                href="/report"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[13.5px] font-semibold transition-all hover:-translate-y-px shrink-0"
                style={{
                  color: "var(--text-inverse)",
                  backgroundColor: "var(--brand)",
                  boxShadow: "var(--shadow-brand)",
                }}
              >
                Start your report
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <PublicReport report={report} country={country} countryOutline={countryOutline} />
      </main>
      <Footer />
    </>
  );
}
