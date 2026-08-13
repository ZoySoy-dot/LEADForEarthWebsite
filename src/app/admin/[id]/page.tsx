import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SDG_GOALS, SDG_LABELS } from "@/data/sdgs";
import { StatusControl, ActionsMenu } from "./ui";

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

// Field-label mappings for each impact subsection (mirror what the form asks).
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

function fmtDate(d: Date | null): string {
  if (!d) return "-";
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(d);
}

function fmtDateTime(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  }).format(d);
}

// Type guard for the impact JSON; treats anything non-object as empty.
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
  return v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await prisma.report.findUnique({
    where: { id },
    include: { reflection: true },
  });

  if (!report) notFound();

  const labelList = (keys: string[], labels: Record<string, string>) =>
    keys.length ? keys.map((k) => labels[k] ?? k).join(", ") : "-";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
          style={{ color: "#2d8c3e" }}
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to reports
        </Link>
        <div className="flex items-center gap-2">
          <StatusControl reportId={report.id} currentStatus={report.status} />
          <ActionsMenu reportId={report.id} reportLabel={`${report.schoolName}; ${report.projectTitle}`} />
        </div>
      </div>

      {/* Report header card */}
      <div
        className="bg-white rounded-3xl p-8 sm:p-10 mb-6"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 20px 60px -20px rgba(26,92,42,0.15)" }}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3"
          style={{ color: "#2d8c3e" }}
        >
          {report.schoolName}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "#0d3d1a" }}>
          {report.projectTitle}
        </h1>
        <p className="text-[14px] text-gray-500 mt-3">
          Submitted {fmtDateTime(report.createdAt)} by <span className="text-gray-700 font-medium">{report.submitterName}</span> ({report.submitterEmail})
        </p>

        {report.description && (
          <p className="text-[15px] text-gray-700 mt-6 leading-relaxed whitespace-pre-wrap">
            {report.description}
          </p>
        )}
      </div>

      <Section title="Project Overview">
        <Row label="Date Implemented" value={fmtDate(report.dateImplemented)} />
        <Row label="Project Duration" value={report.projectDuration} />
        <Row label="Target Participants" value={report.targetParticipants} />
        <Row label="Project Lead" value={report.projectLead} />
        <Row
          label="Type of Initiative"
          value={labelList(report.initiativeTypes, INITIATIVE_LABELS)}
        />
        {report.initiativeOther && <Row label="Other Initiative" value={report.initiativeOther} />}
        <Row label="SDGs Addressed" value={<SdgChips keys={report.sdgGoals} />} />
      </Section>

      <Section title="Participation">
        <Row label="Students" value={report.students?.toString()} />
        <Row label="Faculty" value={report.faculty?.toString()} />
        <Row label="Staff / Admin" value={report.staffAdmin?.toString()} />
        <Row label="Community Members" value={report.community?.toString()} />
        <Row label="Total Participants" value={report.totalParticipants?.toString()} />
        <Row label="School Population" value={report.schoolPopulation?.toString()} />
        <Row label="Participation Rate" value={report.participationRate ? `${report.participationRate}%` : null} />
      </Section>

      <ImpactSection report={report} />

      <EffectivenessSection effectiveness={report.effectiveness} />

      <Section title="Digital Advocacy">
        <Row label="Platforms Used" value={labelList(report.digitalPlatforms, PLATFORM_LABELS)} />
        {report.digitalPlatformOther && <Row label="Other Platform" value={report.digitalPlatformOther} />}
        <Row label="#LEADforEarth Hashtag Used" value={report.hashtagUsed} />
        <Row label="Hashtag Effectiveness" value={report.hashtagEffectiveness} />
        <Row label="Reactions / Likes" value={report.reachReactions?.toLocaleString()} />
        <Row label="Comments" value={report.reachComments?.toLocaleString()} />
        <Row label="Shares / Reposts" value={report.reachShares?.toLocaleString()} />
        <Row label="Reach / Views" value={report.reachViews?.toLocaleString()} />
        <Row label="Post Links" value={report.postLinks} />
      </Section>

      {report.documentationLinks && (
        <Section title="Documentation">
          <p className="text-[14px] text-gray-700 whitespace-pre-wrap">{report.documentationLinks}</p>
        </Section>
      )}

      {report.reflection ? (
        <>
          <Section title="Climate Literacy">
            <Row label="Sessions Included" value={report.reflection.climateIncluded} />
            <Row label="Description" value={report.reflection.climateDescription} />
          </Section>

          <Section title="Participant Feedback">
            <p className="text-[14px] text-gray-700 whitespace-pre-wrap">
              {report.reflection.participantFeedback || "-"}
            </p>
          </Section>

          <Section title="Lasallian Reflection">
            <Row label="Spirit of Faith" value={report.reflection.spiritOfFaith} />
            <Row label="Zeal for Service" value={report.reflection.zealForService} />
            <Row label="Communion in Mission" value={report.reflection.communionInMission} />
          </Section>

          <Section title="Lessons Learned">
            <Row label="What Went Well" value={report.reflection.whatWentWell} />
            <Row label="Challenges" value={report.reflection.challenges} />
            <Row label="Recommendations" value={report.reflection.recommendations} />
            <Row label="Suggestions for District" value={report.reflection.districtSuggestions} />
            <Row label="Continuing next campaign?" value={report.reflection.continuing} />
            {report.reflection.plannedActivity && (
              <Row label="Planned Activity" value={report.reflection.plannedActivity} />
            )}
            {report.reflection.notContinuingReason && (
              <Row label="Reason for Not Continuing" value={report.reflection.notContinuingReason} />
            )}
          </Section>
        </>
      ) : (
        <div
          className="bg-white rounded-3xl p-6 flex items-center gap-4"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(26,92,42,0.1)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#fff8e1", color: "#8a6d00" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-semibold" style={{ color: "#0d3d1a" }}>
              Reflection pending
            </p>
            <p className="text-[13px] text-gray-500">
              The submitter has not yet completed the reflection add-on.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="bg-white rounded-3xl p-6 sm:p-8 mb-6"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 10px 32px -12px rgba(26,92,42,0.1)" }}
    >
      <h2
        className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-5"
        style={{ color: "#2d8c3e" }}
      >
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  const display = value === null || value === undefined || value === "" ? "-" : value;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1 sm:gap-4 py-2 border-b border-gray-50 last:border-0">
      <span className="text-[12px] text-gray-500 font-medium">{label}</span>
      <span className="text-[14px] text-gray-800 whitespace-pre-wrap">{display}</span>
    </div>
  );
}

function SdgChips({ keys }: { keys: string[] }) {
  if (!keys.length) return <>-</>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {keys.map((k) => (
        <span
          key={k}
          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: SDG_COLOR[k] ?? "#666" }}
          title={SDG_LABELS[k]}
        >
          {SDG_LABELS[k] ?? k}
        </span>
      ))}
    </div>
  );
}

function ImpactPanel({
  title, children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{ backgroundColor: "#f7faf7", borderColor: "#e2efe4" }}
    >
      <h3 className="text-[13px] font-semibold mb-3" style={{ color: "#1a5c2a" }}>
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ImpactSection({ report }: { report: { impact: unknown; initiativeTypes: string[] } }) {
  const selected = report.initiativeTypes;
  const otherImpact = (() => {
    if (!report.impact || typeof report.impact !== "object") return null;
    const v = (report.impact as Record<string, unknown>)["otherImpact"];
    return typeof v === "string" && v.trim() ? v : null;
  })();

  const anyContent = selected.length > 0 || !!otherImpact;

  return (
    <Section title="Environmental Impact">
      {!anyContent && <p className="text-[13px] text-gray-500">No impact data was recorded.</p>}

      <div className="space-y-4">
        {selected.map((key) => renderImpactPanel(key, report.impact))}
        {otherImpact && (
          <ImpactPanel title="Other Environmental Actions">
            <p className="text-[14px] text-gray-800 whitespace-pre-wrap">{otherImpact}</p>
          </ImpactPanel>
        )}
      </div>
    </Section>
  );
}

function renderImpactPanel(key: string, impact: unknown): React.ReactNode {
  const data = bucket(impact, key);
  const title = INITIATIVE_LABELS[key] ?? key;

  // Special-case buckets that carry a nested boolean map.
  if (key === "biodiversity") {
    const types = pickedFrom(data.types);
    return (
      <ImpactPanel key={key} title={title}>
        {types.length > 0 && (
          <Row label="Type of Activity" value={types.map((t) => BIODIVERSITY_TYPE_LABELS[t] ?? t).join(", ")} />
        )}
        {renderFieldRows(key, data)}
      </ImpactPanel>
    );
  }
  if (key === "education") {
    const types = pickedFrom(data.types);
    return (
      <ImpactPanel key={key} title={title}>
        {types.length > 0 && (
          <Row label="Type of Activity" value={types.map((t) => EDUCATION_TYPE_LABELS[t] ?? t).join(", ")} />
        )}
        {renderFieldRows(key, data)}
      </ImpactPanel>
    );
  }
  if (key === "cleanup") {
    const areas = pickedFrom(data.areas);
    return (
      <ImpactPanel key={key} title={title}>
        {areas.length > 0 && (
          <Row label="Area of Clean-Up" value={areas.map((a) => CLEANUP_AREA_LABELS[a] ?? a).join(", ")} />
        )}
        {renderFieldRows(key, data)}
      </ImpactPanel>
    );
  }
  if (key === "other") {
    // "Other Environmental Actions" is rendered separately via `otherImpact`.
    return null;
  }

  return (
    <ImpactPanel key={key} title={title}>
      {renderFieldRows(key, data)}
    </ImpactPanel>
  );
}

function renderFieldRows(key: string, data: ImpactBucket): React.ReactNode {
  const labels = IMPACT_FIELD_LABELS[key];
  if (!labels) return <p className="text-[13px] text-gray-500">No detail fields.</p>;
  const rows = Object.entries(labels)
    .filter(([field]) => !isEmpty(data[field]))
    .map(([field, label]) => <Row key={field} label={label} value={String(data[field])} />);
  return rows.length ? rows : <p className="text-[13px] text-gray-500">No values recorded.</p>;
}

function EffectivenessSection({ effectiveness }: { effectiveness: unknown }) {
  const items = Array.isArray(effectiveness)
    ? (effectiveness as { criteria?: string; rating?: string; remarks?: string }[])
    : [];
  const filled = items.filter((i) => (i.rating && i.rating !== "") || (i.remarks && i.remarks !== ""));

  return (
    <Section title="Effectiveness of Implementation">
      {filled.length === 0 ? (
        <p className="text-[13px] text-gray-500">No effectiveness ratings were provided.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0"
            >
              <RatingChip value={item.rating ?? ""} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-gray-800">{item.criteria ?? `Criteria ${i + 1}`}</p>
                {item.remarks && (
                  <p className="text-[13px] text-gray-600 mt-1 whitespace-pre-wrap">{item.remarks}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function RatingChip({ value }: { value: string }) {
  const n = Number(value);
  const valid = Number.isFinite(n) && n >= 1 && n <= 5;
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      style={{
        backgroundColor: valid ? "#1a5c2a" : "#f3f4f6",
        color: valid ? "#ffffff" : "#9ca3af",
      }}
    >
      <span className="text-base font-bold leading-none">{valid ? n : "-"}</span>
    </div>
  );
}
