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
  if (!d) return "—";
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
          style={{ color: "#2d8c3e" }}
        >
          Reports Dashboard
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ color: "#0d3d1a" }}
        >
          Submitted Reports
        </h1>
        <p className="mt-3 text-[15px] text-gray-500 leading-relaxed max-w-xl">
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
          className="bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 10px 32px -10px rgba(26,92,42,0.1)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500 border-b border-gray-100">
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
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <Link href={`/admin/${r.id}`} className="block">
                        <div className="font-semibold text-[14px]" style={{ color: "#0d3d1a" }}>
                          {r.schoolName}
                        </div>
                        <div className="text-[13px] text-gray-500 mt-0.5 line-clamp-1">
                          {r.projectTitle}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">by {r.submitterName}</div>
                      </Link>
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-4 px-5 text-[13px] text-gray-600 whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="py-4 px-5 text-[13px] text-gray-600 whitespace-nowrap">
                      {formatDate(r.dateImplemented)}
                    </td>
                    <td className="py-4 px-5 text-[13px] text-gray-800 font-medium">
                      {r.totalParticipants?.toLocaleString() ?? "—"}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {r.initiativeTypes.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "#f0faf1", color: "#1a5c2a" }}
                          >
                            {INITIATIVE_LABELS[t] ?? t}
                          </span>
                        ))}
                        {r.initiativeTypes.length > 3 && (
                          <span className="text-[10.5px] text-gray-500 self-center">
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
                            className="inline-flex items-center justify-center w-5 h-5 rounded text-white text-[9.5px] font-bold"
                            style={{ backgroundColor: SDG_COLOR[s] ?? "#666" }}
                            title={s.toUpperCase()}
                          >
                            {s.replace("sdg", "")}
                          </span>
                        ))}
                        {r.sdgGoals.length > 6 && (
                          <span className="text-[10.5px] text-gray-500 self-center">
                            +{r.sdgGoals.length - 6}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      {r.hasReflections ? (
                        <span
                          className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "#f0faf1", color: "#1a5c2a" }}
                        >
                          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 6.5L5 9l4.5-5" />
                          </svg>
                          Complete
                        </span>
                      ) : (
                        <span className="inline-block text-[10.5px] font-medium px-2 py-0.5 rounded-full text-gray-500 bg-gray-100">
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

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new: { bg: "#f0faf1", color: "#1a5c2a", label: "New" },
  pending: { bg: "#fff8e1", color: "#8a6d00", label: "Pending" },
  approved: { bg: "#1a5c2a", color: "#ffffff", label: "Approved" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES["new"];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color === "#ffffff" ? "#ffffff" : s.color, opacity: 0.9 }} />
      {s.label}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="bg-white rounded-2xl p-5"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(26,92,42,0.12)" }}
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
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 10px 32px -10px rgba(26,92,42,0.1)" }}
    >
      <div
        className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#f0faf1", color: "#1a5c2a" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: "#0d3d1a" }}>
        No reports yet
      </h3>
      <p className="text-[14px] text-gray-500 max-w-sm mx-auto leading-relaxed">
        Submitted reports from participating schools will appear here.
      </p>
    </div>
  );
}
