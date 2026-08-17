import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReplyForm, ArchiveButton } from "./ui";

function fmtDateTime(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  }).format(d);
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });

  if (!inquiry) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-6 transition-colors"
        style={{ color: "var(--brand-mid)" }}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to inquiries
      </Link>

      {/* Header */}
      <div
        className="rounded-3xl p-8 sm:p-10 mb-6"
        style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-strong)" }}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--brand-mid)" }}
          >
            Subject
          </p>
          <StatusBadge status={inquiry.status} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text-heading)" }}>
          {inquiry.subject}
        </h1>
      </div>

      {/* Original message */}
      <MessageCard
        who={`${inquiry.firstName} ${inquiry.lastName}`}
        email={inquiry.email}
        time={inquiry.createdAt}
        body={inquiry.message}
        variant="incoming"
      />

      {/* Reply thread */}
      {inquiry.replies.map((r) => (
        <MessageCard
          key={r.id}
          who={r.authorName ?? r.authorEmail}
          email={r.authorEmail}
          time={r.createdAt}
          body={r.body}
          variant="outgoing"
        />
      ))}

      {/* Reply form */}
      <div
        className="rounded-3xl p-6 sm:p-8 mb-6"
        style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
      >
        <h2
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-5"
          style={{ color: "var(--brand-mid)" }}
        >
          Send Reply
        </h2>
        <p className="text-[13px] mb-5" style={{ color: "var(--text-muted)" }}>
          Sends an email from <span className="font-medium" style={{ color: "var(--text-body)" }}>{process.env.SMTP_USER ?? "the committee inbox"}</span> to <span className="font-medium" style={{ color: "var(--text-body)" }}>{inquiry.email}</span>. Any reply they send back will land in Gmail, not here.
        </p>
        <ReplyForm inquiryId={inquiry.id} />
      </div>

      {inquiry.status !== "archived" && (
        <div className="flex justify-end">
          <ArchiveButton inquiryId={inquiry.id} />
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    new: { bg: "var(--surface-accent)", color: "var(--brand)", label: "New" },
    replied: { bg: "var(--surface-sunken)", color: "var(--brand-mid)", label: "Replied" },
    archived: { bg: "var(--overlay-hover-strong)", color: "var(--text-muted)", label: "Archived" },
  };
  const s = styles[status] ?? styles["new"];
  return (
    <span
      className="inline-block text-[10.5px] font-semibold px-2.5 py-1 rounded-full shrink-0"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function MessageCard({
  who, email, time, body, variant,
}: {
  who: string;
  email: string;
  time: Date;
  body: string;
  variant: "incoming" | "outgoing";
}) {
  const isOutgoing = variant === "outgoing";
  return (
    <div
      className="rounded-3xl p-6 sm:p-8 mb-4"
      style={{
        backgroundColor: isOutgoing ? "var(--surface-accent)" : "var(--surface)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0"
          style={{
            backgroundColor: isOutgoing ? "var(--brand)" : "var(--brand-mid)",
            color: "var(--text-inverse)",
          }}
        >
          {who.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold truncate" style={{ color: "var(--text-heading)" }}>
              {who}
            </p>
            {isOutgoing && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                style={{ backgroundColor: "var(--surface)", color: "var(--brand)" }}
              >
                Committee
              </span>
            )}
          </div>
          <p className="text-[12px] truncate" style={{ color: "var(--text-muted)" }}>{email}</p>
        </div>
        <p className="text-[11.5px] whitespace-nowrap shrink-0" style={{ color: "var(--text-subtle)" }}>
          {fmtDateTime(time)}
        </p>
      </div>
      <p className="text-[14.5px] leading-[1.7] whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>{body}</p>
    </div>
  );
}
