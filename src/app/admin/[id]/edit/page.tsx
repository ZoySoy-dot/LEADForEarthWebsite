import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditReportForm } from "./form";

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) notFound();

  const initial = {
    schoolName: report.schoolName,
    projectTitle: report.projectTitle,
    description: report.description ?? "",
    dateImplemented: report.dateImplemented
      ? report.dateImplemented.toISOString().slice(0, 10)
      : "",
    projectDuration: report.projectDuration ?? "",
    targetParticipants: report.targetParticipants ?? "",
    projectLead: report.projectLead ?? "",
    students: report.students?.toString() ?? "",
    faculty: report.faculty?.toString() ?? "",
    staffAdmin: report.staffAdmin?.toString() ?? "",
    community: report.community?.toString() ?? "",
    totalParticipants: report.totalParticipants?.toString() ?? "",
    schoolPopulation: report.schoolPopulation?.toString() ?? "",
    participationRate: report.participationRate?.toString() ?? "",
    submitterName: report.submitterName,
    submitterRole: report.submitterRole,
    submitterPhone: report.submitterPhone ?? "",
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/admin/${id}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-6 transition-colors"
        style={{ color: "var(--brand-mid)" }}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to report
      </Link>

      <div className="mb-8">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3"
          style={{ color: "var(--brand-mid)" }}
        >
          Edit Report
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: "var(--text-heading)" }}>
          {report.projectTitle}
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
          Edit typos and correct basic info. Complex fields (SDGs, initiative impact data, effectiveness ratings) are read-only here; those come straight from the submitter&apos;s form.
        </p>
      </div>

      <EditReportForm reportId={id} initial={initial} />
    </div>
  );
}
