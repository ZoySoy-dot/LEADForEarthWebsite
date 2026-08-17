import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SDG_GOALS } from "@/data/sdgs";
import { ClickableRow } from "./clickable-row";

const INITIATIVE_LABELS: Record<string, string> = {
  energy: "Energy",
  water: "Water",
  biodiversity: "Biodiversity",
  waste: "Waste",
  education: "Education",
  cleanup: "Clean-Up",
  circular: "Circular",
  other: "Other",
};

const SDG_COLOR: Record<string, string> = Object.fromEntries(
  SDG_GOALS.map((g) => [g.key, g.color])
);

function formatDate(d: Date | null): string {
  if (!d) return "-";
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(d);
}

export default async function AdminHome() {
  const [reports, totalReports, reportsWithReflection, totalParticipantsAgg] = await Promise.all([
    prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        schoolName: true,
        projectTitle: true,
        dateImplemented: true,
        totalParticipants: true,
        initiativeTypes: true,
        sdgGoals: true,
        hasReflections: true,
        submitterName: true,
        status: true,
      },
    }),
    prisma.report.count(),
    prisma.report.count({ where: { hasReflections: true } }),
    prisma.report.aggregate({ _sum: { totalParticipants: true } }),
  ]);

  const totalParticipants = totalParticipantsAgg._sum.totalParticipants ?? 0;

  return (
    <div>
      {/* Page heading */}
      <div className="mb-10">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3"
          style={{ color: "var(--brand-mid)" }}
        >
          Reports Dashboard
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ color: "var(--text-heading)" }}
        >
          Submitted Reports
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
          Every #LEADforEarth report filed by participating schools. Newest first.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Reports" value={totalReports.toString()} />
        <StatCard label="With Reflections" value={`${reportsWithReflection} / ${totalReports}`} />
        <StatCard label="Total Participants" value={totalParticipants.toLocaleString()} />
      </div>

      {reports.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          className="rounded-3xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead
                className="text-[11px] font-semibold uppercase tracking-[0.15em] border-b"
                style={{ color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}
              >
                <tr>
                  <th className="py-4 px-5">School / Project</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Submitted</th>
                  <th className="py-4 px-5">Implemented</th>
                  <th className="py-4 px-5">Participants</th>
                  <th className="py-4 px-5">Initiatives</th>
                  <th className="py-4 px-5">SDGs</th>
                  <th className="py-4 px-5">Reflection</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <ClickableRow
                    key={r.id}
                    href={`/admin/${r.id}`}
                    className="border-b border-[var(--border-subtle)] last:border-0 transition-colors hover:bg-[var(--overlay-hover)]"
                  >
                    <td className="py-4 px-5">
                      <Link href={`/admin/${r.id}`} className="block">
                        <div className="font-semibold text-[14px]" style={{ color: "var(--text-heading)" }}>
                          {r.schoolName}
                        </div>
                        <div className="text-[13px] mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>
                          {r.projectTitle}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--text-subtle)" }}>by {r.submitterName}</div>
                      </Link>
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-4 px-5 text-[13px] whitespace-nowrap" style={{ color: "var(--text-body)" }}>
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="py-4 px-5 text-[13px] whitespace-nowrap" style={{ color: "var(--text-body)" }}>
                      {formatDate(r.dateImplemented)}
                    </td>
                    <td className="py-4 px-5 text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                      {r.totalParticipants?.toLocaleString() ?? "-"}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {r.initiativeTypes.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "var(--surface-accent)", color: "var(--brand)" }}
                          >
                            {INITIATIVE_LABELS[t] ?? t}
                          </span>
                        ))}
                        {r.initiativeTypes.length > 3 && (
                          <span className="text-[10.5px] self-center" style={{ color: "var(--text-muted)" }}>
                            +{r.initiativeTypes.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {r.sdgGoals.slice(0, 6).map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center justify-center w-5 h-5 rounded text-[9.5px] font-bold"
                            style={{ backgroundColor: SDG_COLOR[s] ?? "#666", color: "var(--text-inverse)" }}
                            title={s.toUpperCase()}
                          >
                            {s.replace("sdg", "")}
                          </span>
                        ))}
                        {r.sdgGoals.length > 6 && (
                          <span className="text-[10.5px] self-center" style={{ color: "var(--text-muted)" }}>
                            +{r.sdgGoals.length - 6}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      {r.hasReflections ? (
                        <span
                          className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "var(--surface-accent)", color: "var(--success-fg)" }}
                        >
                          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.5L5 9l4.5-5" />
                          </svg>
                          Complete
                        </span>
                      ) : (
                        <span
                          className="inline-block text-[10.5px] font-medium px-2 py-0.5 rounded-full"
                          style={{ color: "var(--text-muted)", backgroundColor: "var(--overlay-hover)" }}
                        >
                          Pending
                        </span>
                      )}
                    </td>
                  </ClickableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Status badge palette; "approved" uses inverse text on a solid brand fill.
const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new: { bg: "var(--surface-accent)", color: "var(--success-fg)", label: "New" },
  pending: { bg: "var(--surface-sunken)", color: "var(--brand-mid)", label: "Pending" },
  approved: { bg: "var(--brand)", color: "var(--text-inverse)", label: "Approved" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES["new"];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color, opacity: 0.9 }} />
      {s.label}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-heading)" }}>
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-3xl p-12 sm:p-16 text-center"
      style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "var(--surface-accent)", color: "var(--brand)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: "var(--text-heading)" }}>
        No reports yet
      </h3>
      <p className="text-[14px] max-w-sm mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
        Submitted reports from participating schools will appear here.
      </p>
    </div>
  );
}
