"use client";

import { useState } from "react";
import SchoolAutocomplete from "@/components/SchoolAutocomplete";
import { LEAD_SCHOOLS } from "@/data/schools";

type FormState = "idle" | "loading" | "success" | "error";
type JoinType = "" | "person" | "institution";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition";
const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

export default function Contact() {
  const [purpose, setPurpose]   = useState("");
  const [joinType, setJoinType] = useState<JoinType>("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", subject: "", message: "",
    // person-specific
    school: "",
    // institution-specific
    institutionName: "", country: "", institutionType: "", contactRole: "",
  });
  const [status, setStatus]     = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePurpose(key: string) {
    setPurpose(key);
    if (key !== "join") setJoinType("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, purpose, joinType }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
      setPurpose("");
      setJoinType("");
      setForm({ firstName: "", lastName: "", email: "", subject: "", message: "", school: "", institutionName: "", country: "", institutionType: "", contactRole: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const isJoin = purpose === "join";

  return (
    <section id="contact" style={{ backgroundColor: "#fafbfa" }} className="py-28 sm:py-36">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-4" style={{ color: "#2d8c3e" }}>
            Contact Us
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6" style={{ color: "#0d3d1a" }}>
            Let&apos;s
            <span style={{ color: "#2d8c3e" }}> connect.</span>
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto font-light">
            Whether you want to help us, join the initiative, or ask questions, send us a message.
          </p>
        </div>

        <div
          className="bg-white rounded-3xl p-8 sm:p-10"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 12px 40px -12px rgba(26,92,42,0.12)" }}
        >
          {status === "success" ? (
            <div className="text-center py-12">
              <div
                className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#f0faf1", color: "#1a5c2a" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: "#0d3d1a" }}>Message sent</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Thank you for reaching out. We&apos;ll get back to you soon.</p>
              <button
                onClick={() => setStatus("idle")}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px"
                style={{
                  backgroundColor: "#1a5c2a",
                  boxShadow: "0 8px 24px -8px rgba(26,92,42,0.35)",
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-6" style={{ color: "#1a5c2a" }}>Send Us a Message</h3>

              {status === "error" && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Step 1: Purpose */}
              <div className="mb-6">
                <p className={labelCls}>What brings you here?</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      key: "question",
                      label: "Ask a Question",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      ),
                    },
                    {
                      key: "inquiry",
                      label: "General Inquiry",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <rect x="4" y="3" width="16" height="18" rx="2" />
                          <path d="M8 8h8M8 12h8M8 16h5" />
                        </svg>
                      ),
                    },
                    {
                      key: "join",
                      label: "Join the Initiative",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M12 22V12" />
                          <path d="M4 8c0-3 2-5 5-5 0 5-2 8-5 8V8z" />
                          <path d="M20 6c0-3-2-5-5-5 0 5 2 8 5 8V6z" />
                        </svg>
                      ),
                    },
                  ].map(({ key, label, icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handlePurpose(key)}
                      className="flex flex-col items-center gap-2 px-3 py-4 rounded-xl border text-sm font-medium transition-all duration-200"
                      style={{
                        borderColor:     purpose === key ? "#1a5c2a" : "#e5e7eb",
                        backgroundColor: purpose === key ? "#f0faf1" : "#fff",
                        color:           purpose === key ? "#1a5c2a" : "#6b7280",
                      }}
                    >
                      {icon}
                      <span className="text-center leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Join type (only for "join") */}
              {isJoin && (
                <div className="mb-6 p-4 rounded-xl border border-green-100 bg-green-50/50">
                  <p className={labelCls}>Are you joining as…</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        key: "person",
                        label: "An Individual",
                        desc: "Student, educator, or advocate",
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        ),
                      },
                      {
                        key: "institution",
                        label: "An Institution",
                        desc: "School, university, or organization",
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M3 21h18" />
                            <path d="M5 21V10l7-5 7 5v11" />
                            <path d="M9 21v-6h6v6" />
                          </svg>
                        ),
                      },
                    ].map(({ key, label, icon, desc }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setJoinType(key as JoinType)}
                        className="flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left"
                        style={{
                          borderColor:     joinType === key ? "#1a5c2a" : "#e5e7eb",
                          backgroundColor: joinType === key ? "#f0faf1" : "#fff",
                          color:           joinType === key ? "#1a5c2a" : "#6b7280",
                        }}
                      >
                        <span className="mt-0.5 shrink-0">{icon}</span>
                        <span className="min-w-0">
                          <span className="block text-[15px] leading-tight">{label}</span>
                          <span className="block text-xs font-normal mt-0.5" style={{ color: joinType === key ? "#2d8c3e" : "#9ca3af" }}>{desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>

                {/* Person fields */}
                {(!isJoin || joinType === "person") && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>First Name</label>
                        <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                          placeholder="Juan" required className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Last Name</label>
                        <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                          placeholder="Dela Cruz" required className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="you@example.com" required className={inputCls} />
                    </div>
                    {isJoin && joinType === "person" && (
                      <div>
                        <label className={labelCls}>School / Organization <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input type="text" name="school" value={form.school} onChange={handleChange}
                          placeholder="De La Salle University" className={inputCls} />
                      </div>
                    )}
                  </>
                )}

                {/* Institution fields */}
                {isJoin && joinType === "institution" && (
                  <>
                    <SchoolAutocomplete
                      label="Institution Name"
                      path="institutionName"
                      value={form.institutionName}
                      onChange={(_, name) => {
                        const school = LEAD_SCHOOLS.find((s) => s.name === name);
                        setForm((prev) => ({
                          ...prev,
                          institutionName: name,
                          ...(school ? { country: school.country } : {}),
                        }));
                      }}
                      required
                      placeholder="De La Salle University"
                      hint="Autocomplete from Lasallian East Asia District schools. Type freely if yours isn't listed."
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Country / Region</label>
                        <input type="text" name="country" value={form.country} onChange={handleChange}
                          placeholder="Philippines" required className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Type of Institution</label>
                        <select name="institutionType" value={form.institutionType} onChange={handleChange}
                          required className={inputCls}>
                          <option value="">Select…</option>
                          <option>Basic Education School</option>
                          <option>College / University</option>
                          <option>NGO / Non-profit</option>
                          <option>Government Agency</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Contact Person</label>
                        <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                          placeholder="Juan Dela Cruz" required className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Role / Position</label>
                        <input type="text" name="contactRole" value={form.contactRole} onChange={handleChange}
                          placeholder="Sustainability Officer" required className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Contact Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="you@institution.edu" required className={inputCls} />
                    </div>
                  </>
                )}

                {/* Subject + Message: always shown except when join type not yet chosen */}
                {(!isJoin || joinType !== "") && (
                  <>
                    {!isJoin && (
                      <div>
                        <label className={labelCls}>Subject</label>
                        <input type="text" name="subject" value={form.subject} onChange={handleChange}
                          placeholder="How can we help?" required className={inputCls} />
                      </div>
                    )}
                    <div>
                      <label className={labelCls}>Message</label>
                      <textarea rows={4} name="message" value={form.message} onChange={handleChange}
                        placeholder={
                          joinType === "person"      ? "Tell us why you want to join and what you hope to contribute…" :
                          joinType === "institution" ? "Tell us how your institution would like to get involved…" :
                          "Tell us about your inquiry…"
                        }
                        required
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3.5 rounded-full font-semibold text-white transition-all duration-200 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: "#1a5c2a",
                        boxShadow: "0 8px 24px -8px rgba(26,92,42,0.35)",
                      }}
                    >
                      {status === "loading" ? "Sending…" : "Send Message"}
                    </button>
                  </>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
