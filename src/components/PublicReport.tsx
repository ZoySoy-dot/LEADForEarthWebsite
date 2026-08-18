import Image from "next/image";
import type { Reflection, Report } from "@prisma/client";
import { SDG_GOALS, SDG_LABELS } from "@/data/sdgs";

// ---- Label maps (mirror the form's option copy) ---------------------------

const INITIATIVE_LABELS: Record<string, string> = {
  energy: "Energy Conservation",
  water: "Water Conservation",
  biodiversity: "Biodiversity Conservation",
  waste: "Waste Reduction / Recycling",
  education: "Environmental Education",
  cleanup: "Clean-Up Drive",
  circular: "Circular Economy Drive",
  other: "Other",
};

const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "X / Twitter",
  other: "Other",
};

const SDG_COLOR: Record<string, string> = Object.fromEntries(
  SDG_GOALS.map((g) => [g.key, g.color])
);

const COUNTRY_FLAG_CODE: Record<string, string> = {
  Japan: "jp",
  "Hong Kong": "hk",
  Malaysia: "my",
  Myanmar: "mm",
  Philippines: "ph",
  Singapore: "sg",
  Thailand: "th",
};

const IMPACT_FIELD_LABELS: Record<string, Record<string, string>> = {
  energy: {
    baselineKwh: "Baseline (1 month before, kWh)",
    postKwh: "Post-activity (1 month after, kWh)",
    kwhReduced: "kWh Reduced",
    costSavings: "Estimated Cost Savings",
    unitsParticipating: "Classrooms/Offices/Departments Participating",
  },
  water: {
    baselineWater: "Baseline (1 month before, L / m³)",
    postWater: "Post-activity (1 month after, L / m³)",
    litersSaved: "Estimated Liters Saved",
    costSavings: "Estimated Cost Savings",
    unitsParticipating: "Classrooms/Offices/Departments Participating",
  },
  biodiversity: {
    speciesPlanted: "Native Species Planted/Protected",
    areaRehabilitated: "Area Rehabilitated (sqm / hectares)",
    awarenessActivities: "Awareness Activities Conducted",
    partnerOrgs: "Partner Organizations",
    unitsParticipating: "Classrooms/Offices/Departments Participating",
  },
  waste: {
    baselineKg: "Baseline (1 month before, kg)",
    postKg: "Post-activity (1 month after, kg)",
    totalCollected: "Total Waste Collected (kg)",
    recycledDiverted: "Waste Recycled / Diverted (kg)",
    reductionPct: "Reduction in Waste Generation (%)",
    unitsParticipating: "Classrooms/Offices/Departments Participating",
  },
  education: {
    sessions: "Sessions Conducted",
    speakers: "Speakers / Resource Persons",
    materials: "Educational Materials Distributed",
    attendees: "Attendees",
  },
  cleanup: {
    areaOther: "Other Area (specified)",
    wasteCollected: "Total Waste Collected (kg)",
    areaCleaned: "Area Cleaned (sqm / hectares)",
    bagsFilled: "Trash Bags Filled",
    partnerOrgs: "Partner Organizations",
    volunteers: "Volunteers Involved",
  },
  circular: {
    itemsCollected: "Donated Items Collected",
    itemsRedistributed: "Items Sold / Redistributed",
    fundsRaised: "Funds Raised",
    beneficiaryOrgs: "Beneficiary Organization(s)",
    partnerOrgs: "Partner Organizations",
    volunteers: "Volunteers Involved",
  },
};

const BIODIVERSITY_TYPE_LABELS: Record<string, string> = {
  habitat: "Habitat Restoration",
  species: "Native Species Protection",
  greening: "Campus Greening",
  awareness: "Wildlife Awareness Campaign",
};

const EDUCATION_TYPE_LABELS: Record<string, string> = {
  forum: "Forum",
  seminar: "Seminar",
  workshop: "Workshop",
  awareness: "Awareness Campaign",
};

const CLEANUP_AREA_LABELS: Record<string, string> = {
  campus: "Campus",
  community: "Community",
  river: "River",
  coastal: "Coastal",
  park: "Park",
  other: "Other",
};

// Palette — routed through CSS variables so dark mode flips automatically.
const GREEN_DARK = "var(--text-heading)";
const GREEN_MID = "var(--brand-mid)";
const GREEN_LIGHT = "var(--brand-light)";
const GREEN_PALE = "var(--brand-pale)";
const GREEN_CREAM = "var(--brand-cream)";
const CREAM = "var(--brand-cream-warm)";

// Signum Fidei star: retained specifically for the "Spirit of Faith"
// Lasallian reflection section where the name literally means "Sign of Faith".
const STAR_PATH =
  "M 12,1 L 14.7,9.2 L 23.3,9.2 L 16.3,14.3 L 19.0,22.5 L 12,17.4 L 5,22.5 L 7.7,14.3 L 0.7,9.2 L 9.3,9.2 Z";
// Leaf mark for eco decoration; replaces the star flourish on the hero and
// reflection divider so the report reads as environmental first.
const LEAF_PATH =
  "M11 20A7 7 0 0 1 4 13c0-6 6-11 15-11 0 8-4 15-8 15z";

// ---- Helpers --------------------------------------------------------------

function fmtDate(d: Date | null): string {
  if (!d) return "-";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function fmtShortDate(d: Date | null): string {
  if (!d) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(0)}k`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

type ImpactBucket = Record<string, unknown>;
function bucket(impact: unknown, key: string): ImpactBucket {
  if (!impact || typeof impact !== "object") return {};
  const v = (impact as Record<string, unknown>)[key];
  return v && typeof v === "object" ? (v as ImpactBucket) : {};
}

function pickedFrom(obj: unknown): string[] {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj as Record<string, unknown>)
    .filter(([, v]) => v === true)
    .map(([k]) => k);
}

function isEmpty(v: unknown): boolean {
  return (
    v === null ||
    v === undefined ||
    v === "" ||
    (Array.isArray(v) && v.length === 0)
  );
}

// Try to parse a stringified number from the impact JSON (form serializes numbers as strings).
function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

const labelList = (keys: string[], labels: Record<string, string>) =>
  keys.length ? keys.map((k) => labels[k] ?? k).join(", ") : "-";

// ---- View -----------------------------------------------------------------

type ReportWithReflection = Report & { reflection: Reflection | null };

type CountryOutline = {
  d: string;
  bbox: [[number, number], [number, number]];
  schoolPoint?: { x: number; y: number } | null;
};

export default function PublicReport({
  report,
  country,
  countryOutline,
}: {
  report: ReportWithReflection;
  country: string | null;
  countryOutline?: CountryOutline | null;
}) {
  const headlineImpact = pickHeadlineImpact(report);
  const totalReach =
    (report.reachReactions ?? 0) +
    (report.reachComments ?? 0) +
    (report.reachShares ?? 0) +
    (report.reachViews ?? 0);

  return (
    <div className="relative">
      <CountryBackdrop countryOutline={countryOutline ?? null} />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8 sm:py-12 space-y-8">
        <HeroCard report={report} country={country} countryOutline={countryOutline ?? null} />

      <ImpactStatRow
        totalParticipants={report.totalParticipants ?? 0}
        headline={headlineImpact}
        totalReach={totalReach}
        sdgCount={report.sdgGoals.length}
      />

      <Section title="Project Details" icon={<IconInfo />}>
        <Row label="Date Implemented" value={fmtDate(report.dateImplemented)} />
        <Row label="Project Duration" value={report.projectDuration} />
        <Row label="Target Participants" value={report.targetParticipants} />
        <Row label="Project Lead" value={report.projectLead} />
        <Row
          label="Type of Initiative"
          value={labelList(report.initiativeTypes, INITIATIVE_LABELS)}
        />
        {report.initiativeOther && (
          <Row label="Other Initiative" value={report.initiativeOther} />
        )}
      </Section>

      <ParticipationSection report={report} />

      <ImpactSection report={report} />

      <EffectivenessSection effectiveness={report.effectiveness} />

      <DigitalReachSection
        platforms={report.digitalPlatforms}
        platformOther={report.digitalPlatformOther}
        hashtagUsed={report.hashtagUsed}
        hashtagEffectiveness={report.hashtagEffectiveness}
        reactions={report.reachReactions}
        comments={report.reachComments}
        shares={report.reachShares}
        views={report.reachViews}
        postLinks={report.postLinks}
      />

      {report.documentationLinks && (
        <Section title="Documentation" icon={<IconFolder />}>
          <p
            className="text-[14px] whitespace-pre-wrap leading-relaxed"
            style={{ color: GREEN_DARK }}
          >
            {report.documentationLinks}
          </p>
        </Section>
      )}

      {report.reflection && (
        <>
          <ReflectionDivider />

          <ClimateLiteracySection reflection={report.reflection} />
          <ParticipantFeedbackSection reflection={report.reflection} />
          <LasallianReflectionSection reflection={report.reflection} />
          <LessonsLearnedSection reflection={report.reflection} />
        </>
      )}
      </div>
    </div>
  );
}

// ---- COUNTRY BACKDROP -----------------------------------------------------

// Country outline tiled down the length of the report so it's always visible
// in the background as the reader scrolls, while still moving with the page
// (not fixed/sticky). Bounded to the report wrapper so it can't reach the
// footer. The first tile carries the star at the reporting school's actual
// coordinates; subsequent tiles show the outline only.
const TILE_COUNT = 8;   // enough copies to back a very long report
const TILE_STRIDE = 60; // vh between tiles; matches max-h so they abut
function CountryBackdrop({ countryOutline }: { countryOutline: CountryOutline | null }) {
  if (!countryOutline) return null;

  const [minX, minY] = countryOutline.bbox[0];
  const [maxX, maxY] = countryOutline.bbox[1];
  const bboxW = maxX - minX;
  const bboxH = maxY - minY;

  // For sprawling / multi-part countries (Malaysia's peninsula + Borneo,
  // Philippines' 7000-island archipelago), showing the full bbox produces
  // an unreadable smear. Frame a fixed window around the school instead so
  // the outline reads as "the school's region" plus surrounding coastline.
  // Small countries (HK, SG) fall through and get their full outline.
  const TARGET_WINDOW = 160; // ~8 degrees in the base projection
  const useFocusedWindow =
    countryOutline.schoolPoint && Math.max(bboxW, bboxH) > TARGET_WINDOW;

  let viewBox: string;
  let refDim: number;
  if (useFocusedWindow) {
    const sp = countryOutline.schoolPoint!;
    const half = TARGET_WINDOW / 2;
    viewBox = `${sp.x - half} ${sp.y - half} ${TARGET_WINDOW} ${TARGET_WINDOW}`;
    refDim = TARGET_WINDOW;
  } else {
    viewBox = `${minX} ${minY} ${bboxW} ${bboxH}`;
    refDim = Math.max(bboxW, bboxH);
  }

  const starRadius = refDim * 0.014;
  const STAR =
    "M 0,-1 L 0.225,-0.309 L 0.951,-0.309 L 0.363,0.118 L 0.588,0.809 L 0,0.382 L -0.588,0.809 L -0.363,0.118 L -0.951,-0.309 L -0.225,-0.309 Z";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {Array.from({ length: TILE_COUNT }).map((_, i) => (
        <div
          key={i}
          className="absolute right-[4vw]"
          style={{ top: `calc(4vh + ${i * TILE_STRIDE}vh)` }}
        >
          <svg
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            className="w-[80vw] max-w-[520px] sm:max-w-[620px] lg:max-w-[720px] h-auto"
            style={{ maxHeight: `${TILE_STRIDE}vh` }}
          >
            <path d={countryOutline.d} fill={GREEN_DARK} opacity="0.04" />
            <path
              d={countryOutline.d}
              fill="none"
              stroke={GREEN_DARK}
              strokeWidth={2}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.14"
            />
            {/* Star only on the first tile so the school pin sits near the
                top of the report. Repeating it on every tile would look wrong. */}
            {i === 0 && countryOutline.schoolPoint && (
              <g
                transform={`translate(${countryOutline.schoolPoint.x} ${countryOutline.schoolPoint.y})`}
              >
                <circle r={starRadius * 2.2} fill={GREEN_MID} opacity="0.12" />
                <circle r={starRadius * 1.4} fill={GREEN_MID} opacity="0.22" />
                <path
                  d={STAR}
                  transform={`scale(${starRadius})`}
                  fill={GREEN_DARK}
                  stroke={GREEN_CREAM}
                  strokeWidth={0.14}
                  strokeLinejoin="round"
                  opacity="0.85"
                />
              </g>
            )}
          </svg>
        </div>
      ))}
    </div>
  );
}

// ---- HERO -----------------------------------------------------------------

function HeroCard({
  report,
  country,
  countryOutline,
}: {
  report: ReportWithReflection;
  country: string | null;
  countryOutline: CountryOutline | null;
}) {
  const flagCode = country ? COUNTRY_FLAG_CODE[country] : undefined;

  return (
    <section
      className="relative rounded-3xl overflow-hidden px-8 sm:px-12 py-10 sm:py-14"
      style={{ backgroundColor: GREEN_CREAM }}
    >
      {/* When no country match, keep the leaf flourish inside the hero card.
          Matched countries use the full-page CountryBackdrop instead. */}
      {!countryOutline && (
        <>
          <svg
            viewBox="0 0 24 24"
            className="absolute -top-8 -right-8 sm:top-2 sm:right-4 w-48 h-48 sm:w-40 sm:h-40 pointer-events-none"
            aria-hidden="true"
            style={{ opacity: 0.08, transform: "rotate(-20deg)" }}
          >
            <path d={LEAF_PATH} fill={GREEN_DARK} />
          </svg>
          <svg
            viewBox="0 0 24 24"
            className="absolute bottom-4 right-6 w-24 h-24 sm:w-28 sm:h-28 pointer-events-none"
            aria-hidden="true"
            style={{ opacity: 0.05, transform: "rotate(160deg)" }}
          >
            <path d={LEAF_PATH} fill={GREEN_DARK} />
          </svg>
        </>
      )}

      {/* Country + school */}
      <div className="flex items-center gap-2 mb-5 relative">
        {flagCode && (
          <Image
            src={`https://flagcdn.com/w40/${flagCode}.png`}
            alt=""
            width={18}
            height={13}
            className="rounded-[2px]"
            style={{
              objectFit: "cover",
              boxShadow: "0 0 0 1px var(--border-subtle)",
            }}
          />
        )}
        <span
          className="text-[10.5px] font-bold uppercase tracking-[0.22em]"
          style={{ color: GREEN_MID }}
        >
          {country ?? "LEAD District"} · {report.schoolName}
        </span>
      </div>

      {/* Big display title */}
      <h1
        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5 relative"
        style={{ color: GREEN_DARK }}
      >
        {report.projectTitle}
      </h1>

      {/* Lead paragraph */}
      {report.description && (
        <p
          className="text-[17px] sm:text-[18px] leading-[1.65] max-w-2xl relative"
          style={{ color: "var(--text-body)" }}
        >
          {report.description}
        </p>
      )}

      {/* Meta row */}
      <div
        className="flex flex-wrap gap-x-6 gap-y-3 mt-8 pt-6 border-t relative"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <MetaItem icon={<IconCalendar />} label="Implemented">
          {fmtShortDate(report.dateImplemented)}
        </MetaItem>
        {report.projectDuration && (
          <MetaItem icon={<IconClock />} label="Duration">
            {report.projectDuration}
          </MetaItem>
        )}
        {report.projectLead && (
          <MetaItem icon={<IconUser />} label="Project Lead">
            {report.projectLead}
          </MetaItem>
        )}
      </div>

      {/* SDG chips */}
      {report.sdgGoals.length > 0 && (
        <div className="mt-6 relative">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2.5"
            style={{ color: "var(--text-muted)" }}
          >
            Sustainable Development Goals
          </p>
          <div className="flex flex-wrap gap-1.5">
            {report.sdgGoals.map((k) => (
              <span
                key={k}
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: SDG_COLOR[k] ?? "#666" }}
                title={SDG_LABELS[k]}
              >
                {SDG_LABELS[k] ?? k}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function MetaItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="flex-none w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
        style={{ backgroundColor: "var(--surface)", color: GREEN_DARK }}
      >
        {icon}
      </span>
      <div>
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </p>
        <p
          className="text-[13.5px] font-semibold"
          style={{ color: GREEN_DARK }}
        >
          {children}
        </p>
      </div>
    </div>
  );
}

// ---- IMPACT STATS ---------------------------------------------------------

type HeadlineImpact = { value: string; label: string; icon: React.ReactNode } | null;

function pickHeadlineImpact(report: ReportWithReflection): HeadlineImpact {
  const impact = report.impact;
  const has = (k: string, f: string) => num(bucket(impact, k)[f]) !== null;

  const pick = (
    check: boolean,
    key: string,
    field: string,
    formatter: (n: number) => string,
    label: string,
    icon: React.ReactNode
  ): HeadlineImpact => {
    if (!check) return null;
    const n = num(bucket(impact, key)[field]);
    if (n === null) return null;
    return { value: formatter(n), label, icon };
  };

  // Priority order: pick the first initiative that has a headline number.
  return (
    pick(has("energy", "kwhReduced"), "energy", "kwhReduced", (n) => `${fmtCompact(n)}`, "kWh saved", <IconBolt />) ??
    pick(has("water", "litersSaved"), "water", "litersSaved", (n) => `${fmtCompact(n)} L`, "water saved", <IconDroplet />) ??
    pick(has("biodiversity", "speciesPlanted"), "biodiversity", "speciesPlanted", (n) => fmtCompact(n), "plants / species", <IconLeaf />) ??
    pick(has("waste", "recycledDiverted"), "waste", "recycledDiverted", (n) => `${fmtCompact(n)} kg`, "waste diverted", <IconRecycle />) ??
    pick(has("cleanup", "wasteCollected"), "cleanup", "wasteCollected", (n) => `${fmtCompact(n)} kg`, "waste collected", <IconRecycle />) ??
    pick(has("circular", "itemsRedistributed"), "circular", "itemsRedistributed", (n) => fmtCompact(n), "items redistributed", <IconRecycle />) ??
    pick(has("education", "attendees"), "education", "attendees", (n) => fmtCompact(n), "learners reached", <IconBookOpen />) ??
    null
  );
}

function ImpactStatRow({
  totalParticipants,
  headline,
  totalReach,
  sdgCount,
}: {
  totalParticipants: number;
  headline: HeadlineImpact;
  totalReach: number;
  sdgCount: number;
}) {
  const cards = [
    totalParticipants > 0 && {
      value: fmtCompact(totalParticipants),
      label: "People engaged",
      icon: <IconUsers />,
    },
    headline && { value: headline.value, label: headline.label, icon: headline.icon },
    totalReach > 0 && {
      value: fmtCompact(totalReach),
      label: "Online reach",
      icon: <IconHeart />,
    },
    sdgCount > 0 && {
      value: sdgCount.toString(),
      label: sdgCount === 1 ? "SDG advanced" : "SDGs advanced",
      icon: <IconTarget />,
    },
  ].filter(Boolean) as { value: string; label: string; icon: React.ReactNode }[];

  if (cards.length === 0) return null;

  return (
    <div
      className={`grid grid-cols-2 ${
        cards.length >= 4 ? "sm:grid-cols-4" : cards.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
      } gap-3`}
    >
      {cards.map((c, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 sm:p-6"
          style={{
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3"
            style={{ backgroundColor: GREEN_PALE, color: GREEN_DARK }}
          >
            {c.icon}
          </span>
          <p
            className="text-2xl sm:text-3xl font-bold tracking-tight leading-none"
            style={{ color: GREEN_DARK }}
          >
            {c.value}
          </p>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.15em] mt-2"
            style={{ color: "var(--text-muted)" }}
          >
            {c.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---- PARTICIPATION --------------------------------------------------------

function ParticipationSection({ report }: { report: ReportWithReflection }) {
  const students = report.students ?? 0;
  const faculty = report.faculty ?? 0;
  const staff = report.staffAdmin ?? 0;
  const community = report.community ?? 0;
  const total = report.totalParticipants ?? students + faculty + staff + community;
  const population = report.schoolPopulation ?? 0;
  const rate = report.participationRate
    ? Number(report.participationRate)
    : population > 0
      ? (total / population) * 100
      : null;

  if (total === 0 && population === 0) return null;

  const segments = [
    { label: "Students", value: students, color: "var(--brand)" },
    { label: "Faculty", value: faculty, color: "var(--brand-mid)" },
    { label: "Staff / Admin", value: staff, color: "var(--brand-light)" },
    { label: "Community", value: community, color: "var(--brand-glow)" },
  ].filter((s) => s.value > 0);

  return (
    <Section title="Who Took Part" icon={<IconUsers />}>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <p
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-none"
            style={{ color: GREEN_DARK }}
          >
            {total.toLocaleString()}
          </p>
          <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
            total participants
          </p>
        </div>
        {rate !== null && (
          <div className="text-right">
            <p
              className="text-2xl font-bold tracking-tight leading-none"
              style={{ color: GREEN_MID }}
            >
              {rate.toFixed(1)}%
            </p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
              of school population
            </p>
          </div>
        )}
      </div>

      {/* Stacked bar */}
      {segments.length > 0 && (
        <>
          <div
            className="flex h-3 rounded-full overflow-hidden mt-4"
            style={{ backgroundColor: "var(--surface-sunken)" }}
          >
            {segments.map((s) => (
              <div
                key={s.label}
                style={{
                  width: `${(s.value / total) * 100}%`,
                  backgroundColor: s.color,
                }}
                title={`${s.label}: ${s.value}`}
              />
            ))}
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-4">
            {segments.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-none"
                  style={{ backgroundColor: s.color }}
                />
                <div className="min-w-0">
                  <p
                    className="text-[13px] font-semibold leading-none"
                    style={{ color: GREEN_DARK }}
                  >
                    {s.value.toLocaleString()}
                  </p>
                  <p
                    className="text-[10.5px] mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}

// ---- ENVIRONMENTAL IMPACT -------------------------------------------------

function ImpactSection({ report }: { report: ReportWithReflection }) {
  const selected = report.initiativeTypes;
  const otherImpact = (() => {
    if (!report.impact || typeof report.impact !== "object") return null;
    const v = (report.impact as Record<string, unknown>)["otherImpact"];
    return typeof v === "string" && v.trim() ? v : null;
  })();

  const anyContent = selected.length > 0 || !!otherImpact;
  if (!anyContent) return null;

  return (
    <Section title="Environmental Impact" icon={<IconLeaf />}>
      <div className="space-y-4">
        {selected.map((key) => renderImpactPanel(key, report.impact))}
        {otherImpact && (
          <ImpactPanel title="Other Environmental Actions" icon={<IconSparkle />}>
            <p
              className="text-[14px] whitespace-pre-wrap leading-relaxed"
              style={{ color: GREEN_DARK }}
            >
              {otherImpact}
            </p>
          </ImpactPanel>
        )}
      </div>
    </Section>
  );
}

const INITIATIVE_ICONS: Record<string, React.ReactNode> = {
  energy: <IconBolt />,
  water: <IconDroplet />,
  biodiversity: <IconLeaf />,
  waste: <IconRecycle />,
  education: <IconBookOpen />,
  cleanup: <IconBroom />,
  circular: <IconRecycle />,
};

function ImpactPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 sm:p-6 border"
      style={{ backgroundColor: GREEN_CREAM, borderColor: "var(--border-brand-soft)" }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        {icon && (
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: "var(--surface)", color: GREEN_DARK }}
          >
            {icon}
          </span>
        )}
        <h3
          className="text-[15px] font-bold tracking-tight"
          style={{ color: GREEN_DARK }}
        >
          {title}
        </h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function renderImpactPanel(key: string, impact: unknown): React.ReactNode {
  const data = bucket(impact, key);
  const title = INITIATIVE_LABELS[key] ?? key;
  const icon = INITIATIVE_ICONS[key];

  if (key === "biodiversity") {
    const types = pickedFrom(data.types);
    return (
      <ImpactPanel key={key} title={title} icon={icon}>
        {types.length > 0 && (
          <Row
            label="Type of Activity"
            value={types.map((t) => BIODIVERSITY_TYPE_LABELS[t] ?? t).join(", ")}
          />
        )}
        {renderFieldRows(key, data)}
      </ImpactPanel>
    );
  }
  if (key === "education") {
    const types = pickedFrom(data.types);
    return (
      <ImpactPanel key={key} title={title} icon={icon}>
        {types.length > 0 && (
          <Row
            label="Type of Activity"
            value={types.map((t) => EDUCATION_TYPE_LABELS[t] ?? t).join(", ")}
          />
        )}
        {renderFieldRows(key, data)}
      </ImpactPanel>
    );
  }
  if (key === "cleanup") {
    const areas = pickedFrom(data.areas);
    return (
      <ImpactPanel key={key} title={title} icon={icon}>
        {areas.length > 0 && (
          <Row
            label="Area of Clean-Up"
            value={areas.map((a) => CLEANUP_AREA_LABELS[a] ?? a).join(", ")}
          />
        )}
        {renderFieldRows(key, data)}
      </ImpactPanel>
    );
  }
  if (key === "other") return null;

  return (
    <ImpactPanel key={key} title={title} icon={icon}>
      {/* Before / after mini bar chart when applicable */}
      {renderBeforeAfter(key, data)}
      {renderFieldRows(key, data)}
    </ImpactPanel>
  );
}

// Small "baseline → after" comparison graphic for the three metrics where the
// form asks both. Falls back to nothing when one side is missing.
function renderBeforeAfter(key: string, data: ImpactBucket): React.ReactNode {
  const map: Record<string, [string, string, string]> = {
    energy: ["baselineKwh", "postKwh", "kWh"],
    water: ["baselineWater", "postWater", "L / m³"],
    waste: ["baselineKg", "postKg", "kg"],
  };
  const fields = map[key];
  if (!fields) return null;
  const [beforeKey, afterKey, unit] = fields;
  const before = num(data[beforeKey]);
  const after = num(data[afterKey]);
  if (before === null || after === null) return null;

  const max = Math.max(before, after, 1);
  const beforePct = (before / max) * 100;
  const afterPct = (after / max) * 100;
  const delta = before - after;
  const deltaPct = before > 0 ? (delta / before) * 100 : 0;

  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--text-muted)" }}
        >
          Baseline vs. after
        </p>
        {delta > 0 && (
          <p
            className="text-[11.5px] font-bold"
            style={{ color: GREEN_MID }}
          >
            ↓ {fmtCompact(delta)} {unit} ({deltaPct.toFixed(0)}%)
          </p>
        )}
      </div>
      <div className="space-y-2">
        <BeforeAfterBar
          label="Before"
          value={before}
          unit={unit}
          pct={beforePct}
          color="var(--brand-glow)"
        />
        <BeforeAfterBar
          label="After"
          value={after}
          unit={unit}
          pct={afterPct}
          color={GREEN_MID}
        />
      </div>
    </div>
  );
}

function BeforeAfterBar({
  label,
  value,
  unit,
  pct,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-[11px] font-semibold w-14 flex-none"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-5 rounded-md overflow-hidden"
        style={{ backgroundColor: "var(--surface-sunken)" }}
      >
        <div
          className="h-full flex items-center justify-end pr-2 rounded-md"
          style={{ width: `${Math.max(pct, 8)}%`, backgroundColor: color }}
        >
          <span
            className="text-[10.5px] font-bold whitespace-nowrap"
            style={{ color: "#ffffff" }}
          >
            {value.toLocaleString()} {unit}
          </span>
        </div>
      </div>
    </div>
  );
}

function renderFieldRows(key: string, data: ImpactBucket): React.ReactNode {
  const labels = IMPACT_FIELD_LABELS[key];
  if (!labels) return null;

  // Fields already surfaced by the baseline/after chart; skip in the row list.
  const alreadyShown = new Set<string>();
  if (key === "energy") ["baselineKwh", "postKwh"].forEach((k) => alreadyShown.add(k));
  if (key === "water") ["baselineWater", "postWater"].forEach((k) => alreadyShown.add(k));
  if (key === "waste") ["baselineKg", "postKg"].forEach((k) => alreadyShown.add(k));

  const rows = Object.entries(labels)
    .filter(([field]) => !alreadyShown.has(field))
    .filter(([field]) => !isEmpty(data[field]))
    .map(([field, label]) => (
      <Row key={field} label={label} value={String(data[field])} />
    ));
  return rows.length ? rows : null;
}

// ---- EFFECTIVENESS --------------------------------------------------------

function EffectivenessSection({ effectiveness }: { effectiveness: unknown }) {
  const items = Array.isArray(effectiveness)
    ? (effectiveness as { criteria?: string; rating?: string; remarks?: string }[])
    : [];
  const filled = items.filter(
    (i) => (i.rating && i.rating !== "") || (i.remarks && i.remarks !== "")
  );
  if (filled.length === 0) return null;

  return (
    <Section title="How It Went" icon={<IconChart />}>
      <div className="space-y-4">
        {filled.map((item, i) => {
          const rating = Number(item.rating ?? "");
          const validRating = Number.isFinite(rating) && rating >= 1 && rating <= 5;
          return (
            <div
              key={i}
              className="pb-4 border-b last:pb-0 last:border-0"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <p
                  className="text-[14.5px] font-semibold"
                  style={{ color: GREEN_DARK }}
                >
                  {item.criteria ?? `Criterion ${i + 1}`}
                </p>
                {validRating && <RatingDots value={rating} />}
              </div>
              {item.remarks && (
                <p
                  className="text-[13.5px] whitespace-pre-wrap leading-relaxed"
                  style={{ color: "var(--text-body)" }}
                >
                  {item.remarks}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function RatingDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: n <= value ? GREEN_DARK : "var(--border-input)" }}
        />
      ))}
      <span
        className="text-[11px] font-bold ml-1.5"
        style={{ color: GREEN_DARK }}
      >
        {value}/5
      </span>
    </div>
  );
}

// ---- DIGITAL REACH --------------------------------------------------------

function DigitalReachSection({
  platforms,
  platformOther,
  hashtagUsed,
  hashtagEffectiveness,
  reactions,
  comments,
  shares,
  views,
  postLinks,
}: {
  platforms: string[];
  platformOther: string | null;
  hashtagUsed: string | null;
  hashtagEffectiveness: string | null;
  reactions: number | null;
  comments: number | null;
  shares: number | null;
  views: number | null;
  postLinks: string | null;
}) {
  const reach = [
    { label: "Reactions", value: reactions ?? 0, icon: <IconHeart /> },
    { label: "Comments", value: comments ?? 0, icon: <IconMessage /> },
    { label: "Shares", value: shares ?? 0, icon: <IconShare /> },
    { label: "Views", value: views ?? 0, icon: <IconEye /> },
  ];
  const anyReach = reach.some((r) => r.value > 0);
  const max = Math.max(...reach.map((r) => r.value), 1);

  return (
    <Section title="Digital Reach" icon={<IconMegaphone />}>
      {platforms.length > 0 && (
        <p
          className="text-[13.5px] mb-4"
          style={{ color: GREEN_DARK }}
        >
          Shared on{" "}
          <span className="font-semibold">
            {labelList(platforms, PLATFORM_LABELS)}
            {platformOther ? ` (${platformOther})` : ""}
          </span>
        </p>
      )}

      {anyReach && (
        <div className="space-y-3 mb-5">
          {reach.map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-none"
                style={{ backgroundColor: GREEN_PALE, color: GREEN_DARK }}
              >
                {r.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <p
                    className="text-[12px] font-semibold uppercase tracking-[0.1em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {r.label}
                  </p>
                  <p
                    className="text-[15px] font-bold tabular-nums"
                    style={{ color: GREEN_DARK }}
                  >
                    {r.value.toLocaleString()}
                  </p>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden mt-1"
                  style={{ backgroundColor: "var(--surface-sunken)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(r.value / max) * 100}%`,
                      backgroundColor: GREEN_MID,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hashtagEffectiveness && (
        <div
          className="rounded-xl p-4 mt-4"
          style={{ backgroundColor: GREEN_CREAM }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 mb-1.5">
            #LEADforEarth impact
          </p>
          <p
            className="text-[13.5px] leading-relaxed whitespace-pre-wrap"
            style={{ color: GREEN_DARK }}
          >
            {hashtagEffectiveness}
          </p>
        </div>
      )}

      {hashtagUsed && !hashtagEffectiveness && (
        <Row label="#LEADforEarth used" value={hashtagUsed} />
      )}
      {postLinks && <Row label="Post Links" value={postLinks} />}
    </Section>
  );
}

// ---- REFLECTION -----------------------------------------------------------

function ReflectionDivider() {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 h-px bg-gray-200" />
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          style={{ color: GREEN_MID, transform: "rotate(-30deg)" }}
          fill="currentColor"
        >
          <path d={LEAF_PATH} />
        </svg>
        <span
          className="text-[10.5px] font-bold uppercase tracking-[0.28em]"
          style={{ color: GREEN_MID }}
        >
          Reflection
        </span>
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          style={{ color: GREEN_MID, transform: "rotate(150deg)" }}
          fill="currentColor"
        >
          <path d={LEAF_PATH} />
        </svg>
      </div>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function ClimateLiteracySection({ reflection }: { reflection: Reflection }) {
  if (!reflection.climateIncluded && !reflection.climateDescription) return null;
  return (
    <Section title="Climate Literacy" icon={<IconBookOpen />}>
      {reflection.climateIncluded && (
        <Row label="Sessions Included" value={reflection.climateIncluded} />
      )}
      {reflection.climateDescription && (
        <p
          className="text-[14.5px] leading-relaxed whitespace-pre-wrap pt-2"
          style={{ color: GREEN_DARK }}
        >
          {reflection.climateDescription}
        </p>
      )}
    </Section>
  );
}

function ParticipantFeedbackSection({ reflection }: { reflection: Reflection }) {
  const fb = reflection.participantFeedback;
  if (!fb) return null;
  return (
    <Section title="Participant Feedback" icon={<IconMessage />}>
      <blockquote
        className="relative pl-6 py-2 border-l-4"
        style={{ borderColor: GREEN_MID }}
      >
        <p
          className="text-[16px] italic leading-[1.75] whitespace-pre-wrap"
          style={{ color: GREEN_DARK }}
        >
          {fb}
        </p>
      </blockquote>
    </Section>
  );
}

function LasallianReflectionSection({ reflection }: { reflection: Reflection }) {
  const items = [
    {
      title: "Spirit of Faith",
      icon: <IconStar />,
      body: reflection.spiritOfFaith,
    },
    {
      title: "Zeal for Service",
      icon: <IconFlame />,
      body: reflection.zealForService,
    },
    {
      title: "Communion in Mission",
      icon: <IconGlobe />,
      body: reflection.communionInMission,
    },
  ].filter((i) => i.body);

  if (items.length === 0) return null;

  return (
    <Section title="Lasallian Reflection" icon={<IconStar />}>
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.title}>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg"
                style={{ backgroundColor: GREEN_PALE, color: GREEN_DARK }}
              >
                {item.icon}
              </span>
              <p
                className="text-[11.5px] font-bold uppercase tracking-[0.18em]"
                style={{ color: GREEN_MID }}
              >
                {item.title}
              </p>
            </div>
            <p
              className="text-[15px] leading-[1.7] whitespace-pre-wrap pl-9"
              style={{ color: GREEN_DARK }}
            >
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function LessonsLearnedSection({ reflection }: { reflection: Reflection }) {
  const rows: [string, string | null][] = [
    ["What Went Well", reflection.whatWentWell],
    ["Challenges", reflection.challenges],
    ["Recommendations", reflection.recommendations],
    ["Suggestions for District", reflection.districtSuggestions],
    ["Continuing next campaign?", reflection.continuing],
    ["Planned Activity", reflection.plannedActivity],
    ["Reason for Not Continuing", reflection.notContinuingReason],
  ];
  const filled = rows.filter(([, v]) => v);
  if (filled.length === 0) return null;

  return (
    <Section title="Lessons Learned" icon={<IconLightbulb />}>
      <div className="space-y-4">
        {filled.map(([label, value]) => (
          <div key={label}>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-gray-500 mb-1.5">
              {label}
            </p>
            <p
              className="text-[14.5px] leading-relaxed whitespace-pre-wrap"
              style={{ color: GREEN_DARK }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---- Rendering primitives --------------------------------------------------

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-3xl p-6 sm:p-8"
      style={{
        backgroundColor: "var(--surface)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        {icon && (
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: GREEN_PALE, color: GREEN_DARK }}
          >
            {icon}
          </span>
        )}
        <h2
          className="text-[15px] font-bold tracking-tight uppercase tracking-[0.05em]"
          style={{ color: GREEN_DARK }}
        >
          {title}
        </h2>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  const display =
    value === null || value === undefined || value === "" ? "-" : value;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 py-2 border-b border-gray-50 last:border-0">
      <span className="text-[12px] text-gray-500 font-medium">{label}</span>
      <span
        className="text-[14px] whitespace-pre-wrap"
        style={{ color: GREEN_DARK }}
      >
        {display}
      </span>
    </div>
  );
}

// ---- Icons ----------------------------------------------------------------

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-4 h-4",
};

function IconCalendar() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg {...iconProps}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg {...iconProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
function IconLeaf() {
  return (
    <svg {...iconProps}>
      <path d="M11 20A7 7 0 0 1 4 13c0-6 6-11 15-11 0 8-4 15-8 15z" />
      <path d="M4 13c2 0 6 1 8 8" />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg {...iconProps}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconDroplet() {
  return (
    <svg {...iconProps}>
      <path d="M12 3c-3.5 4.5-6 8-6 11a6 6 0 0 0 12 0c0-3-2.5-6.5-6-11z" />
    </svg>
  );
}
function IconRecycle() {
  return (
    <svg {...iconProps}>
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  );
}
function IconBookOpen() {
  return (
    <svg {...iconProps}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function IconBroom() {
  return (
    <svg {...iconProps}>
      <path d="M4 20 15 9" />
      <path d="M13 6l5 5" />
      <path d="M9 15l-3 5 5-3" />
      <path d="M17 3l4 4" />
    </svg>
  );
}
function IconMegaphone() {
  return (
    <svg {...iconProps}>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg {...iconProps}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function IconTarget() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg {...iconProps}>
      <path d="M20.8 11.5a5 5 0 0 0-8.8-3.3 5 5 0 0 0-8.8 3.3c0 6 8.8 10.5 8.8 10.5s8.8-4.5 8.8-10.5z" />
    </svg>
  );
}
function IconMessage() {
  return (
    <svg {...iconProps}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconShare() {
  return (
    <svg {...iconProps}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg {...iconProps}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconFolder() {
  return (
    <svg {...iconProps}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d={STAR_PATH} />
    </svg>
  );
}
function IconFlame() {
  return (
    <svg {...iconProps}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function IconLightbulb() {
  return (
    <svg {...iconProps}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8 14a5 5 0 1 1 8 0 4 4 0 0 0-1 3v1H9v-1a4 4 0 0 0-1-3z" />
    </svg>
  );
}
function IconSparkle() {
  return (
    <svg {...iconProps}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}
