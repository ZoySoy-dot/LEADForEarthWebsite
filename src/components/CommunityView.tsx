"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DistrictGlobe from "./DistrictGlobe";
import type { GlobeData } from "@/lib/districtGlobeData";

const COUNTRY_FLAG_CODE: Record<string, string> = {
  Japan: "jp",
  "Hong Kong": "hk",
  Malaysia: "my",
  Myanmar: "mm",
  Philippines: "ph",
  Singapore: "sg",
  Thailand: "th",
};

// Leaf mark for the small "Institutions taking part" section marker.
const LEAF_PATH =
  "M11 20A7 7 0 0 1 4 13c0-6 6-11 15-11 0 8-4 15-8 15z";

type ReportItem = {
  id: string;
  title: string;
  createdAt: string;
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
  items: ReportItem[];
};

type SortKey = "reports" | "recent" | "participants" | "name";

type Props = {
  globeData: GlobeData;
  institutions: Institution[];
  schoolsByCountry: Record<string, Institution[]>;
};

export default function CommunityView({
  globeData,
  institutions,
  schoolsByCountry,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("reports");
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpanded = (name: string) =>
    setExpanded((prev) => (prev === name ? null : name));

  const visible = useMemo(() => {
    const base = selected ? schoolsByCountry[selected] ?? [] : institutions;
    const q = query.trim().toLowerCase();
    // Match school name, country, report title, project lead (org/dept),
    // or the submitter's name. So "energy", "singapore", "juan dela cruz",
    // "sustainability office" all surface relevant institutions.
    const filtered = q
      ? base.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            (i.country?.toLowerCase().includes(q) ?? false) ||
            i.items.some(
              (r) =>
                r.title.toLowerCase().includes(q) ||
                (r.projectLead?.toLowerCase().includes(q) ?? false) ||
                (r.submitterName?.toLowerCase().includes(q) ?? false),
            ),
        )
      : base;
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === "reports") {
        return b.reports - a.reports || a.name.localeCompare(b.name);
      }
      if (sortKey === "recent") {
        const aTime = a.lastReportAt ?? "";
        const bTime = b.lastReportAt ?? "";
        return bTime.localeCompare(aTime) || a.name.localeCompare(b.name);
      }
      if (sortKey === "participants") {
        return b.participants - a.participants || a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }, [selected, query, sortKey, schoolsByCountry, institutions]);

  const totalReports = visible.reduce((s, i) => s + i.reports, 0);
  const totalParticipants = visible.reduce((s, i) => s + i.participants, 0);
  const hasActiveFilters = Boolean(selected) || query.trim() !== "" || sortKey !== "reports";
  const resetFilters = () => {
    setSelected(null);
    setQuery("");
    setSortKey("reports");
  };

  return (
    <>
      {/* Full-bleed hero: background spans viewport width, section fills the
          remaining viewport height below the fixed 68px header. Content stays
          centered inside via max-w-7xl. */}
      <section
        className="relative overflow-hidden flex items-center px-6 sm:px-10 lg:px-14 py-14 sm:py-20"
        style={{ backgroundColor: "var(--brand-cream)", minHeight: "calc(100vh - 68px)" }}
      >
        {/* Editorial botanical blob, top-right */}
        <svg
          aria-hidden="true"
          className="absolute -top-24 -right-20 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] lg:w-[640px] lg:h-[640px] pointer-events-none select-none"
          viewBox="0 0 600 600"
          fill="none"
        >
          <path
            d="M480 60C560 120 590 240 550 350C520 435 430 500 320 505C210 510 130 460 100 370C70 285 105 190 190 130C275 70 400 20 480 60Z"
            style={{ fill: "var(--brand)" }}
            opacity="0.08"
          />
          <path
            d="M450 110C510 160 530 250 500 335C475 400 410 445 330 445C255 445 195 405 175 345C155 285 185 220 245 180C305 140 390 60 450 110Z"
            style={{ fill: "var(--brand-mid)" }}
            opacity="0.07"
          />
        </svg>
        {/* Editorial botanical blob, bottom-left */}
        <svg
          aria-hidden="true"
          className="absolute -bottom-28 -left-24 w-[460px] h-[460px] sm:w-[560px] sm:h-[560px] lg:w-[680px] lg:h-[680px] pointer-events-none select-none"
          viewBox="0 0 600 600"
          fill="none"
        >
          <path
            d="M120 540C40 480 10 360 50 250C80 165 170 100 280 95C390 90 470 140 500 230C530 315 495 410 410 470C325 530 200 600 120 540Z"
            style={{ fill: "var(--brand)" }}
            opacity="0.07"
          />
        </svg>
        {/* Hairline arcs echoing the globe */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <ellipse cx="880" cy="300" rx="360" ry="360" style={{ stroke: "var(--brand-mid)" }} strokeOpacity="0.10" strokeWidth="1" />
          <ellipse cx="880" cy="300" rx="260" ry="260" style={{ stroke: "var(--brand-mid)" }} strokeOpacity="0.07" strokeWidth="1" />
        </svg>

        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(260px,340px)_minmax(400px,560px)] md:justify-center gap-8 md:gap-10 lg:gap-14 items-center">
          <div className="text-center md:text-left">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.24em] mb-3"
              style={{ color: "var(--brand-mid)" }}
            >
              #LEADforEarth
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-4"
              style={{ color: "var(--text-heading)" }}
            >
              Our <span style={{ color: "var(--brand-mid)" }}>Community</span>
            </h1>
            <p
              className="text-[15px] sm:text-[16px] leading-relaxed max-w-xl mx-auto md:mx-0"
              style={{ color: "var(--text-body)" }}
            >
              Seven sectors across East Asia, one Lasallian district
              contributing to the #LEADforEarth campaign.
            </p>
          </div>
          <div>
            <DistrictGlobe
              globeData={globeData}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>
      </section>

      <section
        className="px-6 pt-4 pb-16 sm:pt-6 sm:pb-20"
        style={{ backgroundColor: "var(--surface-page)" }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Campaign proof strip: display-type figures make the numbers
              feel like the second visual beat after the hero. */}
          <div
            className="mb-10 sm:mb-14 rounded-3xl px-6 sm:px-10 py-8 sm:py-10"
            style={{
              backgroundColor: "var(--surface)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 [&>*+*]:border-t sm:[&>*+*]:border-t-0 sm:[&>*+*]:border-l [&>*+*]:[border-color:var(--border-subtle)]">
              <BigStat
                label={selected ? "Schools" : "Institutions"}
                value={visible.length.toLocaleString()}
              />
              <BigStat
                label="Reports Shared"
                value={totalReports.toLocaleString()}
              />
              <BigStat
                label="People Reached"
                value={totalParticipants.toLocaleString()}
              />
            </div>
          </div>

          {/* Sample-report callout so first-time visitors can preview the
              full submission shape before browsing real reports. */}
          <Link
            href="/reports/example"
            className="mb-10 sm:mb-14 rounded-2xl px-5 sm:px-6 py-4 flex items-center gap-4 transition-all hover:-translate-y-px group"
            style={{
              backgroundColor: "var(--surface-accent)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--brand)", color: "var(--text-inverse)" }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <p
                className="text-[13.5px] font-semibold"
                style={{ color: "var(--text-heading)" }}
              >
                See a sample report
              </p>
              <p
                className="text-[12.5px] leading-snug mt-0.5"
                style={{ color: "var(--text-body)" }}
              >
                A fully filled-out example so you can preview what your own submission will look like.
              </p>
            </div>
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[12.5px] font-semibold shrink-0 transition-transform group-hover:translate-x-0.5"
              style={{ color: "var(--brand-mid)" }}
            >
              View
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>

          <div
            className="flex items-baseline justify-between gap-3 mb-4 pb-3 border-b"
            style={{ borderColor: "var(--border-input)" }}
          >
            <div className="flex items-center gap-2.5">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                style={{ fill: "var(--brand-mid)" }}
                aria-hidden="true"
              >
                <path d={LEAF_PATH} />
              </svg>
              <h2
                className="text-lg sm:text-xl font-semibold tracking-tight"
                style={{ color: "var(--text-heading)" }}
              >
                Institutions taking part
              </h2>
            </div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--text-muted)" }}
            >
              {selected ?? "All sectors"}
            </p>
          </div>

          <FilterSection
            selectedCountry={selected}
            onClearCountry={() => setSelected(null)}
            query={query}
            onQueryChange={setQuery}
            sortKey={sortKey}
            onSortChange={setSortKey}
            resultCount={visible.length}
            hasActiveFilters={hasActiveFilters}
            onResetAll={resetFilters}
          />


          {visible.length === 0 ? (
            <EmptyState country={selected} />
          ) : (
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: "var(--surface)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <ul>
                {visible.map((inst) => {
                  const isExpanded = expanded === inst.name;
                  const flagCode = inst.country
                    ? COUNTRY_FLAG_CODE[inst.country]
                    : undefined;
                  return (
                    <li
                      key={inst.name}
                      className="border-b last:border-0"
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleExpanded(inst.name)}
                        aria-expanded={isExpanded}
                        className="w-full flex items-center gap-4 sm:gap-6 px-5 sm:px-7 py-5 text-left cursor-pointer transition-colors"
                        style={{
                          backgroundColor: isExpanded ? "var(--brand-cream)" : undefined,
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = "var(--brand-cream)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = "";
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          {inst.country && (
                            <div className="flex items-center gap-1.5 mb-1">
                              {flagCode && (
                                <Image
                                  src={`https://flagcdn.com/w40/${flagCode}.png`}
                                  alt=""
                                  width={16}
                                  height={12}
                                  className="rounded-[2px]"
                                  style={{
                                    objectFit: "cover",
                                    boxShadow: "0 0 0 1px var(--border-subtle)",
                                  }}
                                />
                              )}
                              <span
                                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {inst.country}
                              </span>
                            </div>
                          )}
                          <p
                            className="font-semibold text-[15px] truncate"
                            style={{ color: "var(--text-heading)" }}
                          >
                            {inst.name}
                          </p>
                          {inst.participants > 0 && (
                            <p
                              className="text-[12.5px] mt-0.5"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {inst.participants.toLocaleString()} people reached
                            </p>
                          )}
                        </div>
                        <div className="flex-none text-right">
                          <p
                            className="text-2xl font-bold tracking-tight leading-none tabular-nums"
                            style={{ color: "var(--text-heading)" }}
                          >
                            {inst.reports.toLocaleString()}
                          </p>
                          <p
                            className="text-[11px] font-medium uppercase tracking-[0.15em] mt-1"
                            style={{ color: "var(--text-subtle)" }}
                          >
                            {inst.reports === 1 ? "report" : "reports"}
                          </p>
                        </div>
                        <svg
                          viewBox="0 0 24 24"
                          className="flex-none w-4 h-4 transition-transform"
                          style={{
                            color: "var(--text-subtle)",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {isExpanded && <ReportList items={inst.items} />}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <p
            className="text-center text-[12.5px] mt-8 leading-relaxed"
            style={{ color: "var(--text-subtle)" }}
          >
            {selected
              ? `Showing schools in ${selected}. Tap the country again or the × to clear.`
              : "Take a look at who's taking part. Institution counts refresh a few minutes after new reports come in."}
          </p>
        </div>
      </section>
    </>
  );
}

function FilterSection({
  selectedCountry,
  onClearCountry,
  query,
  onQueryChange,
  sortKey,
  onSortChange,
  resultCount,
  hasActiveFilters,
  onResetAll,
}: {
  selectedCountry: string | null;
  onClearCountry: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
  resultCount: number;
  hasActiveFilters: boolean;
  onResetAll: () => void;
}) {
  return (
    <div
      className="mb-6 rounded-2xl px-4 sm:px-5 py-4"
      style={{
        backgroundColor: "var(--surface)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-[12.5px]" style={{ color: "var(--text-body)" }}>
          <span
            className="font-bold tabular-nums"
            style={{ color: "var(--text-heading)" }}
          >
            {resultCount.toLocaleString()}
          </span>{" "}
          {resultCount === 1 ? "institution" : "institutions"}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1 text-[11.5px] font-semibold uppercase tracking-[0.15em] transition-colors hover:opacity-70"
            style={{ color: "var(--brand-mid)" }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 0 1 15.5-6.36L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-subtle)" }}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search schools, countries, projects, or people"
            className="w-full h-10 pl-9 pr-3 rounded-full text-[13.5px] border border-transparent focus:outline-none focus:border-[var(--brand-mid)] focus:ring-2 focus:ring-[color:var(--brand-mid)]/15 transition-all"
            style={{
              backgroundColor: "var(--surface-sunken)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-sunken)";
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
              style={{ color: "var(--text-subtle)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--overlay-hover)";
                e.currentTarget.style.color = "var(--text-body)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.color = "var(--text-subtle)";
              }}
              aria-label="Clear search"
            >
              <svg
                viewBox="0 0 24 24"
                width={12}
                height={12}
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative sm:w-56">
          <label htmlFor="sort-key" className="sr-only">
            Sort by
          </label>
          <select
            id="sort-key"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="appearance-none w-full h-10 pl-9 pr-9 rounded-full text-[13.5px] border border-transparent focus:outline-none focus:border-[var(--brand-mid)] focus:ring-2 focus:ring-[color:var(--brand-mid)]/15 transition-all cursor-pointer"
            style={{
              backgroundColor: "var(--surface-sunken)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-sunken)";
            }}
          >
            <option value="reports">Most reports</option>
            <option value="recent">Most recent</option>
            <option value="participants">Most people reached</option>
            <option value="name">Name (A–Z)</option>
          </select>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-subtle)" }}
          >
            <path d="M3 6h18M6 12h12M10 18h4" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-subtle)" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {selectedCountry && (
        <div
          className="mt-3 pt-3 border-t flex items-center gap-2 flex-wrap"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--text-muted)" }}
          >
            Country
          </span>
          <span
            className="inline-flex items-center gap-2 pl-2 pr-1 py-1 rounded-full"
            style={{ backgroundColor: "var(--surface-accent)" }}
          >
            {COUNTRY_FLAG_CODE[selectedCountry] && (
              <Image
                src={`https://flagcdn.com/w40/${COUNTRY_FLAG_CODE[selectedCountry]}.png`}
                alt=""
                width={20}
                height={15}
                className="rounded-sm"
                style={{
                  objectFit: "cover",
                  boxShadow: "0 0 0 1px var(--border-subtle)",
                }}
              />
            )}
            <span
              className="text-[12.5px] font-semibold"
              style={{ color: "var(--text-heading)" }}
            >
              {selectedCountry}
            </span>
            <button
              type="button"
              onClick={onClearCountry}
              className="w-5 h-5 rounded-full flex items-center justify-center transition-colors"
              style={{ color: "var(--text-subtle)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface)";
                e.currentTarget.style.color = "var(--text-body)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.color = "var(--text-subtle)";
              }}
              aria-label="Clear country filter"
            >
              <svg
                viewBox="0 0 24 24"
                width={11}
                height={11}
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

function ReportList({ items }: { items: ReportItem[] }) {
  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  return (
    // Panel bg is a deeper tinted-green than the institution row (surface) so
    // the "these are children of the row above" relationship reads at a
    // glance. Inner scroll caps overall height so 50+ reports don't push
    // everything below off-screen.
    <div style={{ backgroundColor: "var(--brand-cream)" }}>
      <div className="max-h-[60vh] overflow-y-auto">
        <div
          className="sticky top-0 z-10 flex items-center justify-between pl-14 sm:pl-20 pr-5 sm:pr-8 py-3 border-b"
          style={{ backgroundColor: "var(--surface-accent)", borderColor: "var(--border-subtle)" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: "var(--brand)" }}
          >
            Reports from this school
          </p>
          <p
            className="text-[10.5px] font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {items.length} · Newest first
          </p>
        </div>
        <ul className="pl-14 sm:pl-20 pr-3 sm:pr-6 py-3 space-y-2">
          {items.map((r) => (
            <li key={r.id}>
              <Link
                href={`/reports/${r.id}`}
                className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl transition-all hover:-translate-y-px"
                style={{
                  backgroundColor: "var(--surface)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[14px] font-semibold truncate"
                    style={{ color: "var(--text-heading)" }}
                  >
                    {r.title}
                  </p>
                  <p
                    className="text-[11.5px] mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {fmtDate(r.createdAt)}
                    {r.participants != null && r.participants > 0 && (
                      <> · {r.participants.toLocaleString()} participants</>
                    )}
                  </p>
                </div>
                <span
                  className="flex-none inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--brand-mid)" }}
                >
                  View
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BigStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 sm:px-6 py-4 sm:py-2 text-center first:pt-0 sm:first:pt-2 last:pb-0 sm:last:pb-2">
      <p
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none tabular-nums"
        style={{ color: "var(--text-heading)" }}
      >
        {value}
      </p>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.2em] mt-3"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
    </div>
  );
}

function EmptyState({ country }: { country: string | null }) {
  return (
    <div
      className="rounded-3xl p-12 sm:p-16 text-center"
      style={{
        backgroundColor: "var(--surface)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "var(--surface-accent)", color: "var(--brand)" }}
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
      <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: "var(--text-heading)" }}>
        {country ? `No reports yet from ${country}` : "No reports yet"}
      </h3>
      <p
        className="text-[14px] max-w-sm mx-auto leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {country
          ? `Schools in ${country} contributing to #LEADforEarth will appear here.`
          : "Once schools begin submitting #LEADforEarth reports, the community contributing to the campaign will appear here."}
      </p>
    </div>
  );
}
