"use client";

import { useState } from "react";

// Standalone from ReportForm on purpose. This page is reached weeks later from
// an emailed link, by someone who may never see the wizard again, so it is a
// single short page rather than a stepped flow.

const INPUT_CLS =
  "w-full border border-[color:var(--border-input)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-[color:var(--border-input-focus)] transition";
const LABEL_CLS = "block text-sm font-medium mb-1.5";

const YESNO = [
  { key: "Yes", label: "Yes" },
  { key: "No", label: "No" },
];

const CONTINUING = [
  { key: "Yes", label: "Yes" },
  { key: "NotYet", label: "Not yet determined" },
  { key: "No", label: "No" },
];

export type ReflectionValues = {
  climateLiteracy: { included: string; description: string };
  participantFeedback: string;
  lasallianReflection: { spiritOfFaith: string; zealForService: string; communionInMission: string };
  lessons: {
    whatWentWell: string;
    challenges: string;
    recommendations: string;
    districtSuggestions: string;
    continuing: string;
    plannedActivity: string;
    notContinuingReason: string;
  };
};

export const EMPTY_REFLECTION: ReflectionValues = {
  climateLiteracy: { included: "", description: "" },
  participantFeedback: "",
  lasallianReflection: { spiritOfFaith: "", zealForService: "", communionInMission: "" },
  lessons: {
    whatWentWell: "",
    challenges: "",
    recommendations: "",
    districtSuggestions: "",
    continuing: "",
    plannedActivity: "",
    notContinuingReason: "",
  },
};

function Textarea({
  label, value, onChange, rows = 3, hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className={LABEL_CLS} style={{ color: "var(--text-body)" }}>{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_CLS} resize-none`}
        style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
      />
      {hint && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{hint}</p>}
    </div>
  );
}

function RadioGroup({
  label, options, value, onChange,
}: {
  label: string;
  options: readonly { key: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={LABEL_CLS} style={{ color: "var(--text-body)" }}>{label}</label>
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label
            key={opt.key}
            className="flex items-center gap-2 text-sm cursor-pointer"
            style={{ color: "var(--text-body)" }}
          >
            <input
              type="radio"
              checked={value === opt.key}
              onChange={() => onChange(opt.key)}
              className="w-4 h-4 accent-green-700"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function Card({ num, title, subtitle, children }: {
  num: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-3xl p-6 sm:p-8 space-y-5"
      style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-1.5" style={{ color: "var(--brand-mid)" }}>
          Section {num}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "var(--text-heading)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-[14px] mt-1.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function ReflectionForm({
  reportId,
  token,
  projectTitle,
  schoolName,
  initial,
  alreadyFiled,
}: {
  reportId: string;
  token: string;
  projectTitle: string;
  schoolName: string;
  initial: ReflectionValues;
  alreadyFiled: boolean;
}) {
  const [form, setForm] = useState<ReflectionValues>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function setLessons<K extends keyof ReflectionValues["lessons"]>(k: K, v: string) {
    setForm((f) => ({ ...f, lessons: { ...f.lessons, [k]: v } }));
  }
  function setLasallian<K extends keyof ReflectionValues["lasallianReflection"]>(k: K, v: string) {
    setForm((f) => ({ ...f, lasallianReflection: { ...f.lasallianReflection, [k]: v } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(
        `/api/report/${reportId}/reflect?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error ?? "Something went wrong.");
      }
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24">
        <div
          className="rounded-3xl p-10 sm:p-14 text-center"
          style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-strong)" }}
        >
          <div
            className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--surface-accent)", color: "var(--brand)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--text-heading)" }}>
            Reflection saved.
          </h1>
          <p className="text-[16px] mb-8 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Thank you. This is the part the committee reads most closely. You can return to this
            same link any time to revise what you wrote.
          </p>
          <a
            href={`/reports/${reportId}`}
            className="inline-block px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
            style={{ backgroundColor: "var(--brand)", color: "var(--text-inverse)", boxShadow: "var(--shadow-brand-strong)" }}
          >
            View your report
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-3" style={{ color: "var(--brand-mid)" }}>
          #LEADforEarth Reflection
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "var(--text-heading)" }}>
          Tell us how it actually went.
        </h1>
        <p className="text-[16px] leading-relaxed max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
          For <strong>{projectTitle}</strong> at {schoolName}. Every question is optional, and
          honest beats polished. Nothing here is published without the committee&apos;s review.
        </p>
      </div>

      {alreadyFiled && (
        <div
          className="mb-6 rounded-2xl px-5 py-4 text-[13.5px] leading-snug"
          style={{ backgroundColor: "var(--surface-accent)", color: "var(--text-body)" }}
        >
          You&apos;ve already filed a reflection for this report. Your previous answers are loaded
          below, and saving will replace them.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card num="1" title="Climate literacy" subtitle="Did participants walk away knowing something new?">
          <RadioGroup
            label="Did the initiative include pre-event educational sessions and post-event reflection sessions?"
            options={YESNO}
            value={form.climateLiteracy.included}
            onChange={(v) => setForm((f) => ({ ...f, climateLiteracy: { ...f.climateLiteracy, included: v } }))}
          />
          {form.climateLiteracy.included === "Yes" && (
            <Textarea
              label="If yes, briefly describe"
              value={form.climateLiteracy.description}
              onChange={(v) => setForm((f) => ({ ...f, climateLiteracy: { ...f.climateLiteracy, description: v } }))}
            />
          )}
        </Card>

        <Card num="2" title="What people said" subtitle="Quotes, reactions, anything that stuck with you.">
          <Textarea
            label="Key Insights"
            value={form.participantFeedback}
            onChange={(v) => setForm((f) => ({ ...f, participantFeedback: v }))}
            rows={6}
            hint="Provide 3-5 key insights gathered from participants: experiences, learnings, reflections, or feedback."
          />
        </Card>

        <Card num="3" title="Lasallian reflection" subtitle="How the mission showed up in the work.">
          <Textarea
            label="Spirit of Faith"
            value={form.lasallianReflection.spiritOfFaith}
            onChange={(v) => setLasallian("spiritOfFaith", v)}
            hint="How did this activity help participants recognize their responsibility toward creation?"
          />
          <Textarea
            label="Zeal for Service"
            value={form.lasallianReflection.zealForService}
            onChange={(v) => setLasallian("zealForService", v)}
            hint="How did participants demonstrate active service through this initiative?"
          />
          <Textarea
            label="Communion in Mission"
            value={form.lasallianReflection.communionInMission}
            onChange={(v) => setLasallian("communionInMission", v)}
            hint="How did this activity contribute to collaboration within the Lasallian community?"
          />
        </Card>

        <Card num="4" title="Lessons learned" subtitle="Future campaigns learn from this.">
          <Textarea label="A. What Went Well" value={form.lessons.whatWentWell} onChange={(v) => setLessons("whatWentWell", v)} />
          <Textarea label="B. Challenges Encountered" value={form.lessons.challenges} onChange={(v) => setLessons("challenges", v)} />
          <Textarea label="C. Recommendations for Future Implementation" value={form.lessons.recommendations} onChange={(v) => setLessons("recommendations", v)} />
          <Textarea label="D. Suggestions for the District Committee" value={form.lessons.districtSuggestions} onChange={(v) => setLessons("districtSuggestions", v)} />

          <RadioGroup
            label="E. Will your institution be continuing this or a similar activity next campaign month?"
            options={CONTINUING}
            value={form.lessons.continuing}
            onChange={(v) => setLessons("continuing", v)}
          />
          {form.lessons.continuing === "Yes" && (
            <div>
              <label className={LABEL_CLS} style={{ color: "var(--text-body)" }}>Planned Activity</label>
              <input
                className={INPUT_CLS}
                style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
                value={form.lessons.plannedActivity}
                onChange={(e) => setLessons("plannedActivity", e.target.value)}
              />
            </div>
          )}
          {form.lessons.continuing === "No" && (
            <div>
              <label className={LABEL_CLS} style={{ color: "var(--text-body)" }}>Reason</label>
              <input
                className={INPUT_CLS}
                style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
                value={form.lessons.notContinuingReason}
                onChange={(e) => setLessons("notContinuingReason", e.target.value)}
              />
            </div>
          )}
        </Card>

        {status === "error" && (
          <p className="text-[13.5px] font-medium" style={{ color: "var(--danger-fg)" }}>{errorMsg}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-[14px] transition-all duration-200 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--brand)", color: "var(--text-inverse)", boxShadow: "var(--shadow-brand)" }}
          >
            {status === "loading" ? "Saving…" : alreadyFiled ? "Update reflection" : "Save reflection"}
          </button>
        </div>
      </form>
    </div>
  );
}
