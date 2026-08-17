"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateStatus, deleteReport } from "./actions";

const STATUS_OPTIONS: { key: string; label: string }[] = [
  { key: "new", label: "New" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; ring: string }> = {
  new: { bg: "var(--surface-accent)", color: "var(--brand)", ring: "var(--border-brand)" },
  pending: { bg: "var(--surface-sunken)", color: "var(--brand-mid)", ring: "var(--border-brand-soft)" },
  approved: { bg: "var(--brand)", color: "var(--text-inverse)", ring: "var(--border-brand)" },
};

export function StatusControl({
  reportId, currentStatus,
}: { reportId: string; currentStatus: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function pick(next: string) {
    setOpen(false);
    if (next === status) return;
    setStatus(next);
    startTransition(async () => {
      const res = await updateStatus(reportId, next);
      if (res.error) {
        setStatus(currentStatus);
        alert(res.error);
      }
    });
  }

  const style = STATUS_STYLES[status] ?? STATUS_STYLES["new"];
  const label = STATUS_OPTIONS.find((o) => o.key === status)?.label ?? "New";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-60"
        style={{
          backgroundColor: style.bg,
          color: style.color,
          boxShadow: `inset 0 0 0 1px ${style.ring}`,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.color, opacity: 0.9 }} />
        {pending ? "Updating…" : label}
        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-[160px] rounded-2xl p-1.5 z-50"
          style={{ backgroundColor: "var(--surface-elevated)", boxShadow: "var(--shadow-strong)" }}
        >
          {STATUS_OPTIONS.map((o) => {
            const active = o.key === status;
            const s = STATUS_STYLES[o.key];
            return (
              <button
                key={o.key}
                type="button"
                role="menuitem"
                onClick={() => pick(o.key)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors text-left"
                style={{ color: "var(--text-body)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--overlay-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {o.label}
                </span>
                {active && (
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--brand)" }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ActionsMenu({
  reportId, reportLabel,
}: { reportId: string; reportLabel: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function handleDelete() {
    setOpen(false);
    const confirmed = window.confirm(
      `Delete this report?\n\n"${reportLabel}"\n\nThis will permanently remove the report and any associated reflection. This action cannot be undone.`
    );
    if (!confirmed) return;
    startTransition(async () => {
      const res = await deleteReport(reportId);
      if (res?.error) {
        alert(res.error);
      } else {
        router.push("/admin");
      }
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Report actions"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "var(--overlay-hover)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-[180px] rounded-2xl p-1.5 z-50"
          style={{ backgroundColor: "var(--surface-elevated)", boxShadow: "var(--shadow-strong)" }}
        >
          <Link
            href={`/admin/${reportId}/edit`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors"
            style={{ color: "var(--text-body)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--overlay-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            Edit
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleDelete}
            disabled={pending}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors text-left disabled:opacity-50"
            style={{ color: "var(--danger-fg)" }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "var(--danger-bg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
