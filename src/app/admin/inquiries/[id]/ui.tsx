"use client";

import { useState, useTransition } from "react";
import { sendReply, archiveInquiry } from "../actions";

const INPUT_CLS =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none";

export function ReplyForm({ inquiryId }: { inquiryId: string }) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!body.trim()) return;

    startTransition(async () => {
      const res = await sendReply(inquiryId, body);
      if (res.error) setError(res.error);
      else {
        setSuccess(true);
        setBody("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        rows={6}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your reply…"
        className={INPUT_CLS}
        disabled={pending}
      />
      {error && <p className="text-[13px] text-red-600 font-medium">{error}</p>}
      {success && (
        <p className="text-[13px] font-medium" style={{ color: "#1a5c2a" }}>
          Reply sent.
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending || !body.trim()}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full font-semibold text-[13.5px] text-white transition-all duration-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{
            backgroundColor: "#1a5c2a",
            boxShadow: "0 6px 16px -4px rgba(26,92,42,0.4)",
          }}
        >
          {pending ? (
            "Sending…"
          ) : (
            <>
              Send Reply
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function ArchiveButton({ inquiryId }: { inquiryId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!confirm("Archive this inquiry? It will remain viewable but move out of the active inbox.")) return;
    setError(null);
    startTransition(async () => {
      const res = await archiveInquiry(inquiryId);
      if (res.error) setError(res.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="px-4 py-2 rounded-full text-[12.5px] font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
      >
        {pending ? "Archiving…" : "Archive"}
      </button>
      {error && <span className="text-[11px] text-red-600">{error}</span>}
    </div>
  );
}
