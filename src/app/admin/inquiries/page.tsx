import Link from "next/link";
import { prisma } from "@/lib/prisma";

function fmtRelative(d: Date): string {
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new: { bg: "var(--surface-accent)", color: "var(--brand)", label: "New" },
  replied: { bg: "var(--surface-sunken)", color: "var(--brand-mid)", label: "Replied" },
  archived: { bg: "var(--overlay-hover-strong)", color: "var(--text-muted)", label: "Archived" },
};

export default async function InquiriesListPage() {
  const [inquiries, counts] = await Promise.all([
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { _count: { select: { replies: true } } },
    }),
    prisma.inquiry.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countByStatus: Record<string, number> = Object.fromEntries(
    counts.map((c) => [c.status, c._count._all])
  );

  return (
    <div>
      <div className="mb-10">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3"
          style={{ color: "var(--brand-mid)" }}
        >
          Contact Inbox
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ color: "var(--text-heading)" }}
        >
          Inquiries
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
          Messages sent through the LEADForEarth contact form. Replies you send from here go straight to the sender&apos;s inbox.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="New" value={(countByStatus["new"] ?? 0).toString()} />
        <StatCard label="Replied" value={(countByStatus["replied"] ?? 0).toString()} />
        <StatCard label="Archived" value={(countByStatus["archived"] ?? 0).toString()} />
      </div>

      {inquiries.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          className="rounded-3xl overflow-hidden"
          style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
        >
          <ul>
            {inquiries.map((q) => {
              const style = STATUS_STYLES[q.status] ?? STATUS_STYLES["new"];
              return (
                <li key={q.id} className="last:border-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <Link
                    href={`/admin/inquiries/${q.id}`}
                    className="block px-6 sm:px-8 py-5 transition-colors hover:bg-[color:var(--overlay-hover)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-[14.5px] truncate" style={{ color: "var(--text-heading)" }}>
                            {q.firstName} {q.lastName}
                          </p>
                          <span className="text-[12px]" style={{ color: "var(--text-subtle)" }}>·</span>
                          <p className="text-[13px] truncate" style={{ color: "var(--text-muted)" }}>{q.email}</p>
                        </div>
                        <p className="text-[13.5px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                          {q.subject}
                        </p>
                        <p className="text-[13px] mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                          {q.message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span
                          className="inline-block text-[10.5px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: style.bg, color: style.color }}
                        >
                          {style.label}
                        </span>
                        <span className="text-[11px] whitespace-nowrap" style={{ color: "var(--text-subtle)" }}>
                          {fmtRelative(q.createdAt)}
                        </span>
                        {q._count.replies > 0 && (
                          <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                            {q._count.replies} {q._count.replies === 1 ? "reply" : "replies"}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
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
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: "var(--text-heading)" }}>
        Inbox is empty
      </h3>
      <p className="text-[14px] max-w-sm mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
        Messages submitted through the contact form will appear here.
      </p>
    </div>
  );
}
