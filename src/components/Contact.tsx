"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

const inputCls =
  "w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-[14.5px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition";
const labelCls = "block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-2";

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
    <section id="contact" style={{ backgroundColor: "#fafbfa" }} className="py-24 sm:py-32 relative overflow-hidden">
      {/* Subtle decorative accents */}
      <div
        aria-hidden="true"
        className="absolute -left-32 top-24 w-80 h-80 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, #e8f5e9 0%, rgba(232,245,233,0) 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-24 w-96 h-96 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, #f0f7ff 0%, rgba(240,247,255,0) 70%)" }}
      />

      <div className="relative max-w-5xl mx-auto px-6">
        {status === "success" ? (
          <div className="max-w-xl mx-auto">
            <div
              className="bg-white rounded-3xl px-6 sm:px-10 py-12"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 20px 60px -20px rgba(26,92,42,0.18)" }}
            >
              <SuccessState onReset={() => setStatus("idle")} />
            </div>
          </div>
        ) : (
          <div
            className="bg-white rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 20px 60px -20px rgba(26,92,42,0.18)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
              {/* LEFT: Heading + supporting copy */}
              <div
                className="px-8 sm:px-10 lg:px-12 py-10 lg:py-12 relative overflow-hidden"
                style={{
                  background:
                    "radial-gradient(600px 300px at 0% 0%, #f0faf1 0%, rgba(240,250,241,0) 60%), #ffffff",
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: "#f0faf1" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1a5c2a"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                    aria-hidden="true"
                  >
                    <path d="M11 20A7 7 0 0 1 4 13c0-6 6-11 15-11 0 8-4 15-8 15z" />
                    <path d="M4 13c2 0 6 1 8 8" />
                  </svg>
                </div>

                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-3"
                  style={{ color: "#2d8c3e" }}
                >
                  Get in touch
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] mb-4"
                  style={{ color: "#0d3d1a" }}
                >
                  Contact us
                </h2>
                <p className="text-[15px] text-gray-500 leading-relaxed mb-8 max-w-xs">
                  Questions, ideas, or ready to bring your campus in? Drop us a note.
                </p>

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-2">
                    Prefer email?
                  </p>
                  <a
                    href="mailto:LeadForEarth@gmail.com"
                    className="text-[14px] font-semibold hover:opacity-70 transition break-all"
                    style={{ color: "#1a5c2a" }}
                  >
                    LeadForEarth@gmail.com
                  </a>
                </div>
              </div>

              {/* RIGHT: Form */}
              <div className="px-6 sm:px-10 lg:px-12 py-10 lg:py-12" style={{ backgroundColor: "#fafbfa" }}>
                {status === "error" && (
                  <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-[13.5px]">
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
                      <label htmlFor="firstName" className={labelCls}>
                        First name <span className="text-red-500">*</span>
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
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelCls}>
                        Last name <span className="text-red-500">*</span>
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
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className={labelCls}>
                        Email <span className="text-red-500">*</span>
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
                      />
                    </div>
                    <div>
                      <label htmlFor="organization" className={labelCls}>
                        Organization <span className="font-normal text-gray-400 normal-case tracking-normal">(optional)</span>
                      </label>
                      <input
                        id="organization"
                        type="text"
                        name="organization"
                        value={form.organization}
                        onChange={handleChange}
                        placeholder="De La Salle University"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className={labelCls}>
                      Subject <span className="text-red-500">*</span>
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
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className={labelCls}>
                      Message <span className="text-red-500">*</span>
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
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-[14px] text-white transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      style={{
                        backgroundColor: "#1a5c2a",
                        boxShadow: "0 10px 24px -8px rgba(26,92,42,0.45)",
                      }}
                    >
                      {status === "loading" ? (
                        <>
                          <svg viewBox="0 0 24 24" className="w-4 h-4 animate-spin" fill="none" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} />
                            <path d="M21 12a9 9 0 0 0-9-9" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" />
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
        style={{ backgroundColor: "#f0faf1", color: "#1a5c2a" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p
        className="text-xs font-semibold uppercase tracking-[0.24em] mb-2"
        style={{ color: "#2d8c3e" }}
      >
        Message received
      </p>
      <h3
        className="text-3xl font-bold tracking-tight mb-3"
        style={{ color: "#0d3d1a" }}
      >
        Thanks for reaching out.
      </h3>
      <p className="text-[15px] text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
        Your message is in. We&apos;ll get back to you soon.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13.5px] font-semibold transition-all duration-200 hover:-translate-y-px"
        style={{
          color: "#1a5c2a",
          backgroundColor: "transparent",
          boxShadow: "inset 0 0 0 1.5px rgba(26,92,42,0.25)",
        }}
      >
        Send another message
      </button>
    </div>
  );
}
