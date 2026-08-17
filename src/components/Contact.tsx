"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

// Inputs pick up their border/background/text/placeholder colors from CSS
// tokens (see globals.css) via inline style so dark mode flips them
// automatically. The focus ring uses focus-visible for keyboard-only.
const inputCls =
  "w-full rounded-xl px-4 py-3 text-[14.5px] focus:outline-none transition";
const inputStyle: React.CSSProperties = {
  border: "1px solid var(--border-input)",
  backgroundColor: "var(--surface)",
  color: "var(--text-primary)",
};
const labelCls = "block text-[11px] font-semibold uppercase tracking-[0.14em] mb-2";
const labelStyle: React.CSSProperties = { color: "var(--text-muted)" };

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: `${form.firstName} ${form.lastName}`.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        organization: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" style={{ backgroundColor: "var(--surface-page)" }} className="py-24 sm:py-32 relative overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-6">
        {status === "success" ? (
          <div className="max-w-xl mx-auto">
            <div
              className="rounded-3xl px-6 sm:px-10 py-12"
              style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-strong)" }}
            >
              <SuccessState onReset={() => setStatus("idle")} />
            </div>
          </div>
        ) : (
          <div
            className="rounded-3xl overflow-hidden"
            style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-strong)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
              {/* LEFT: Heading + supporting copy */}
              <div className="px-8 sm:px-10 lg:px-12 py-10 lg:py-12 relative overflow-hidden" style={{ backgroundColor: "var(--surface)" }}>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: "var(--surface-accent)" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                    style={{ color: "var(--brand)" }}
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>

                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3"
                  style={{ color: "var(--brand-mid)" }}
                >
                  Get in touch
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] mb-4"
                  style={{ color: "var(--text-heading)" }}
                >
                  Contact us
                </h2>
                <p className="text-[15px] leading-relaxed mb-8 max-w-xs" style={{ color: "var(--text-muted)" }}>
                  Questions, ideas, or ready to bring your campus in? Drop us a note.
                </p>

                <div className="pt-6 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: "var(--text-subtle)" }}>
                    Prefer email?
                  </p>
                  <a
                    href="mailto:LeadForEarth@gmail.com"
                    className="text-[14px] font-semibold hover:opacity-70 transition break-all"
                    style={{ color: "var(--brand)" }}
                  >
                    LeadForEarth@gmail.com
                  </a>
                </div>
              </div>

              {/* RIGHT: Form */}
              <div className="px-6 sm:px-10 lg:px-12 py-10 lg:py-12" style={{ backgroundColor: "var(--surface-page)" }}>
                {status === "error" && (
                  <div
                    className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl text-[13.5px]"
                    style={{
                      backgroundColor: "var(--danger-bg)",
                      border: "1px solid var(--danger-border)",
                      color: "var(--danger-fg)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className={labelCls} style={labelStyle}>
                        First name <span style={{ color: "var(--danger-fg)" }}>*</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Juan"
                        required
                        className={inputCls}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelCls} style={labelStyle}>
                        Last name <span style={{ color: "var(--danger-fg)" }}>*</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Dela Cruz"
                        required
                        className={inputCls}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className={labelCls} style={labelStyle}>
                        Email <span style={{ color: "var(--danger-fg)" }}>*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className={inputCls}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label htmlFor="organization" className={labelCls} style={labelStyle}>
                        Organization <span className="font-normal normal-case tracking-normal" style={{ color: "var(--text-subtle)" }}>(optional)</span>
                      </label>
                      <input
                        id="organization"
                        type="text"
                        name="organization"
                        value={form.organization}
                        onChange={handleChange}
                        placeholder="De La Salle University"
                        className={inputCls}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className={labelCls} style={labelStyle}>
                      Subject <span style={{ color: "var(--danger-fg)" }}>*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className={labelCls} style={labelStyle}>
                      Message <span style={{ color: "var(--danger-fg)" }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind…"
                      required
                      className={`${inputCls} resize-y min-h-[110px]`}
                      style={inputStyle}
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-[14px] transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      style={{
                        color: "var(--text-inverse)",
                        backgroundColor: "var(--brand)",
                        boxShadow: "var(--shadow-brand-strong)",
                      }}
                    >
                      {status === "loading" ? (
                        <>
                          <svg viewBox="0 0 24 24" className="w-4 h-4 animate-spin" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} />
                            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          Send message
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-8 sm:py-12">
      <div
        className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "var(--surface-accent)", color: "var(--brand)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p
        className="text-xs font-semibold uppercase tracking-[0.24em] mb-2"
        style={{ color: "var(--brand-mid)" }}
      >
        Message received
      </p>
      <h3
        className="text-3xl font-bold tracking-tight mb-3"
        style={{ color: "var(--text-heading)" }}
      >
        Thanks for reaching out.
      </h3>
      <p className="text-[15px] mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
        Your message is in. We&apos;ll get back to you soon.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13.5px] font-semibold transition-all duration-200 hover:-translate-y-px"
        style={{
          color: "var(--brand)",
          backgroundColor: "transparent",
          boxShadow: "inset 0 0 0 1.5px var(--border-brand)",
        }}
      >
        Send another message
      </button>
    </div>
  );
}
