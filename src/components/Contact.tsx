"use client";

import { useState } from "react";

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
    <section id="contact" style={{ backgroundColor: "#f7faf7" }} className="py-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#2d8c3e" }}>
            Contact Us
          </p>
          <h2 className="text-4xl font-extrabold mb-6" style={{ color: "#1a5c2a" }}>
            Let&apos;s Connect
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto text-lg">
            Whether you want to help us, join the initiative, or ask questions,
            send us a message.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {status === "success" ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#1a5c2a" }}>Message Sent!</h3>
              <p className="text-gray-500 mb-6">Thank you for reaching out. We&apos;ll get back to you soon.</p>
              <button
                onClick={() => setStatus("idle")}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#1a5c2a" }}
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

              {/* Step 1 — Purpose */}
              <div className="mb-6">
                <p className={labelCls}>What brings you here?</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "question", label: "Ask a Question",      icon: "💬" },
                    { key: "inquiry",  label: "General Inquiry",      icon: "📋" },
                    { key: "join",     label: "Join the Initiative",  icon: "🌱" },
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
                      <span className="text-xl">{icon}</span>
                      <span className="text-center leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 — Join type (only for "join") */}
              {isJoin && (
                <div className="mb-6 p-4 rounded-xl border border-green-100 bg-green-50/50">
                  <p className={labelCls}>Are you joining as…</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "person",      label: "An Individual",  icon: "👤", desc: "Student, educator, or advocate" },
                      { key: "institution", label: "An Institution", icon: "🏫", desc: "School, university, or organization" },
                    ].map(({ key, label, icon, desc }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setJoinType(key as JoinType)}
                        className="flex flex-col items-start gap-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left"
                        style={{
                          borderColor:     joinType === key ? "#1a5c2a" : "#e5e7eb",
                          backgroundColor: joinType === key ? "#f0faf1" : "#fff",
                          color:           joinType === key ? "#1a5c2a" : "#6b7280",
                        }}
                      >
                        <span className="text-lg">{icon} {label}</span>
                        <span className="text-xs font-normal" style={{ color: joinType === key ? "#2d8c3e" : "#9ca3af" }}>{desc}</span>
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
                    <div>
                      <label className={labelCls}>Institution Name</label>
                      <input type="text" name="institutionName" value={form.institutionName} onChange={handleChange}
                        placeholder="De La Salle University" required className={inputCls} />
                    </div>
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

                {/* Subject + Message — always shown except when join type not yet chosen */}
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
                      className="w-full py-3 rounded-xl font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#1a5c2a" }}
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
