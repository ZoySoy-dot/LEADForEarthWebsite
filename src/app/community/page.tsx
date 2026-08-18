import type { Metadata } from "next";
import CommunityView from "@/components/CommunityView";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import { LEAD_SCHOOLS_BY_COUNTRY, LEGACY_SCHOOL_ALIASES } from "@/data/schools";
import { LEAD_COUNTRY_IDS } from "@/lib/districtMapData";
import { buildDistrictGlobeData } from "@/lib/districtGlobeData";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Our Community | LEADForEarth",
  description:
    "The Lasallian schools contributing to the #LEADforEarth campaign, and the reports they've shared with the district.",
};

export const revalidate = 300;

type ReportItem = {
  id: string;
  title: string;
  createdAt: string; // ISO
  participants: number | null;
  projectLead: string | null;
  submitterName: string | null;
};

type Institution = {
  name: string;
  country: string | null;
  reports: number;
  participants: number;
  lastReportAt: string | null;
  items: ReportItem[]; // newest first
};

// Fetches every approved report and aggregates in memory by schoolName
// (case-insensitive; schoolName is free-text so "DLSU" and "dlsu" shouldn't
// count as separate schools). Preserves the individual report list on each
// institution so the community page can expand rows into per-report links.
async function loadInstitutions(): Promise<Institution[]> {
  const rows = await prisma.report.findMany({
    where: { status: "approved" },
    select: {
      id: true,
      schoolName: true,
      projectTitle: true,
      createdAt: true,
      totalParticipants: true,
      projectLead: true,
      submitterName: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const byKey = new Map<string, Institution & { casings: Map<string, number> }>();
  for (const row of rows) {
    const raw = row.schoolName.trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    const iso = row.createdAt.toISOString();
    const item: ReportItem = {
      id: row.id,
      title: row.projectTitle,
      createdAt: iso,
      participants: row.totalParticipants ?? null,
      projectLead: row.projectLead ?? null,
      submitterName: row.submitterName ?? null,
    };
    const existing = byKey.get(key);
    if (existing) {
      existing.reports += 1;
      existing.participants += row.totalParticipants ?? 0;
      existing.items.push(item);
      if (!existing.lastReportAt || iso > existing.lastReportAt) {
        existing.lastReportAt = iso;
      }
      existing.casings.set(raw, (existing.casings.get(raw) ?? 0) + 1);
    } else {
      byKey.set(key, {
        name: raw,
        country: SCHOOL_TO_COUNTRY.get(key) ?? null,
        reports: 1,
        participants: row.totalParticipants ?? 0,
        lastReportAt: iso,
        items: [item],
        casings: new Map([[raw, 1]]),
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

// Maps each known Lasallian school name (lowercased) to its country. Used to
// bucket free-text schoolName entries into countries so the globe can filter
// the institutions list by country. Legacy aliases are folded in so reports
// filed under older school-name spellings still bucket correctly.
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

function groupByCountry(institutions: Institution[]): Record<string, Institution[]> {
  const out: Record<string, Institution[]> = {};
  for (const country of Object.keys(LEAD_COUNTRY_IDS)) out[country] = [];
  for (const inst of institutions) {
    const country = SCHOOL_TO_COUNTRY.get(inst.name.toLowerCase());
    if (country && country in out) out[country].push(inst);
  }
  for (const list of Object.values(out)) {
    list.sort((a, b) => b.reports - a.reports || a.name.localeCompare(b.name));
  }
  return out;
}

export default async function CommunityPage() {
  const institutions = await loadInstitutions();
  const globeData = buildDistrictGlobeData();
  const schoolsByCountry = groupByCountry(institutions);

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="pt-[68px] focus:outline-none">
        <CommunityView
          globeData={globeData}
          institutions={institutions}
          schoolsByCountry={schoolsByCountry}
        />
      </main>
      <Footer />
    </>
  );
}
