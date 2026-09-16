// Resolving a school name to its LEAD sector.
//
// This lookup used to be copy-pasted into three pages. It now lives here so the
// community map, the public report page and the submit API all agree, and so a
// roster edit only has to be reasoned about once.
import { LEAD_SCHOOLS_BY_COUNTRY, LEGACY_SCHOOL_ALIASES } from "@/data/schools";

// Lowercased school name to sector. Built once per process.
const SCHOOL_TO_COUNTRY: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  for (const [country, names] of Object.entries(LEAD_SCHOOLS_BY_COUNTRY)) {
    for (const n of names) map.set(n.toLowerCase(), country);
  }
  // Older reports were filed under names that have since changed.
  for (const [legacy, canonical] of Object.entries(LEGACY_SCHOOL_ALIASES)) {
    const country = map.get(canonical.toLowerCase());
    if (country) map.set(legacy, country);
  }
  return map;
})();

export function countryForSchool(schoolName: string | null | undefined): string | null {
  if (!schoolName) return null;
  return SCHOOL_TO_COUNTRY.get(schoolName.trim().toLowerCase()) ?? null;
}

export function canonicalSchoolName(schoolName: string): string {
  return LEGACY_SCHOOL_ALIASES[schoolName.trim().toLowerCase()] ?? schoolName;
}

// Prefer the sector stored on the report. Falls back to resolving the name for
// rows written before the country column existed.
export function reportCountry(report: {
  country?: string | null;
  schoolName: string;
}): string | null {
  return report.country ?? countryForSchool(report.schoolName);
}
