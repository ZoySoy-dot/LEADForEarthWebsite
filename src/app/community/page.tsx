import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Our Community | LEADForEarth",
  description:
    "The Lasallian schools contributing to the #LEADforEarth campaign, and the reports they've shared with the district.",
};

export const revalidate = 300;

type Institution = {
  name: string;
  reports: number;
  participants: number;
};

// Group by schoolName case-insensitively (schoolName is free-text, so "DLSU" and
// "dlsu" shouldn't count as separate schools). Keeps the most-frequent casing
// as the display name.
async function loadInstitutions(): Promise<Institution[]> {
  const grouped = await prisma.report.groupBy({
    by: ["schoolName"],
    where: { status: "approved" },
    _count: { _all: true },
    _sum: { totalParticipants: true },
  });

  const byKey = new Map<string, Institution & { casings: Map<string, number> }>();
  for (const row of grouped) {
    const raw = row.schoolName.trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    const existing = byKey.get(key);
    const count = row._count._all;
    const participants = row._sum.totalParticipants ?? 0;
    if (existing) {
      existing.reports += count;
      existing.participants += participants;
      existing.casings.set(raw, (existing.casings.get(raw) ?? 0) + count);
    } else {
      byKey.set(key, {
        name: raw,
        reports: count,
        participants,
        casings: new Map([[raw, count]]),
      });
    }
  }

  return Array.from(byKey.values())
    .map(({ casings, ...rest }) => {
      const topCasing = Array.from(casings.entries()).sort((a, b) => b[1] - a[1])[0][0];
      return { ...rest, name: topCasing };
    })
    .sort((a, b) => b.reports - a.reports || a.name.localeCompare(b.name));
}

export default async function CommunityPage() {
  const institutions = await loadInstitutions();
  const totalReports = institutions.reduce((s, i) => s + i.reports, 0);
  const totalParticipants = institutions.reduce((s, i) => s + i.participants, 0);

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="pt-[68px] focus:outline-none">
        <section
          className="px-6 py-16 sm:py-20"
          style={{ backgroundColor: "#fafbfa" }}
        >
          <div className="max-w-5xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-12 sm:mb-16">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3"
                style={{ color: "#2d8c3e" }}
              >
                #LEADforEarth
              </p>
              <h1
                className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
                style={{ color: "#0d3d1a" }}
              >
                Our Community
              </h1>
              <p className="text-[15px] sm:text-[16px] text-gray-500 leading-relaxed max-w-2xl mx-auto">
                Lasallian schools across East Asia contributing reports to the
                district-wide campaign. Every submission helps us learn what
                works and what to try next.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <StatCard label="Institutions" value={institutions.length.toLocaleString()} />
              <StatCard label="Reports Shared" value={totalReports.toLocaleString()} />
              <StatCard label="People Reached" value={totalParticipants.toLocaleString()} />
            </div>

            {institutions.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                className="bg-white rounded-3xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04), 0 10px 32px -10px rgba(26,92,42,0.1)",
                }}
              >
                <ul>
                  {institutions.map((inst, i) => (
                    <li
                      key={inst.name}
                      className="flex items-center gap-4 sm:gap-6 px-5 sm:px-7 py-5 border-b border-gray-50 last:border-0"
                    >
                      <span
                        className="flex-none w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold"
                        style={{
                          backgroundColor: i < 3 ? "#1a5c2a" : "#f0faf1",
                          color: i < 3 ? "#ffffff" : "#1a5c2a",
                        }}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold text-[15px] truncate"
                          style={{ color: "#0d3d1a" }}
                        >
                          {inst.name}
                        </p>
                        {inst.participants > 0 && (
                          <p className="text-[12.5px] text-gray-500 mt-0.5">
                            {inst.participants.toLocaleString()} people reached
                          </p>
                        )}
                      </div>
                      <div className="flex-none text-right">
                        <p
                          className="text-2xl font-bold tracking-tight leading-none"
                          style={{ color: "#0d3d1a" }}
                        >
                          {inst.reports.toLocaleString()}
                        </p>
                        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 mt-1">
                          {inst.reports === 1 ? "report" : "reports"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-center text-[12.5px] text-gray-400 mt-8 leading-relaxed">
              Take a look at who&apos;s taking part. Institution counts refresh a
              few minutes after new reports come in.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="bg-white rounded-2xl p-5 text-center sm:text-left"
      style={{
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(26,92,42,0.12)",
      }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
        {label}
      </p>
      <p className="text-2xl font-bold tracking-tight" style={{ color: "#0d3d1a" }}>
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="bg-white rounded-3xl p-12 sm:p-16 text-center"
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 10px 32px -10px rgba(26,92,42,0.1)",
      }}
    >
      <div
        className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#f0faf1", color: "#1a5c2a" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: "#0d3d1a" }}>
        No reports yet
      </h3>
      <p className="text-[14px] text-gray-500 max-w-sm mx-auto leading-relaxed">
        Once schools begin submitting #LEADforEarth reports, the community
        contributing to the campaign will appear here.
      </p>
    </div>
  );
}
