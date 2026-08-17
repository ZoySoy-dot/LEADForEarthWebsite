"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateReport } from "../actions";

type Values = {
  schoolName: string;
  projectTitle: string;
  description: string;
  dateImplemented: string;
  projectDuration: string;
  targetParticipants: string;
  projectLead: string;
  students: string;
  faculty: string;
  staffAdmin: string;
  community: string;
  totalParticipants: string;
  schoolPopulation: string;
  participationRate: string;
  submitterName: string;
  submitterRole: string;
  submitterPhone: string;
};

const INPUT_CLS =
  "w-full rounded-xl px-4 py-3 text-sm border transition focus:outline-none focus:ring-2 text-[color:var(--text-primary)] bg-[color:var(--surface)] border-[color:var(--border-input)] focus:border-[color:var(--border-input-focus)] focus:ring-[color:var(--brand-mid)]/25 placeholder:text-[color:var(--text-subtle)]";
const LABEL_CLS = "block text-sm font-medium mb-1.5 text-[color:var(--text-body)]";

export function EditReportForm({ reportId, initial }: { reportId: string; initial: Values }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Values>(key: K, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await updateReport(reportId, values);
      if (res.error) setError(res.error);
      else router.push(`/admin/${reportId}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card title="Submitter">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={values.submitterName} onChange={(v) => set("submitterName", v)} required />
          <Field label="Role / Position" value={values.submitterRole} onChange={(v) => set("submitterRole", v)} required />
        </div>
        <Field label="Phone (optional)" value={values.submitterPhone} onChange={(v) => set("submitterPhone", v)} />
      </Card>

      <Card title="Project Overview">
        <Field label="School Name" value={values.schoolName} onChange={(v) => set("schoolName", v)} required />
        <Field label="Project Title" value={values.projectTitle} onChange={(v) => set("projectTitle", v)} required />
        <Textarea label="Description" value={values.description} onChange={(v) => set("description", v)} rows={4} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date Implemented" type="date" value={values.dateImplemented} onChange={(v) => set("dateImplemented", v)} />
          <Field label="Project Duration" value={values.projectDuration} onChange={(v) => set("projectDuration", v)} />
        </div>
        <Field label="Target Participants" value={values.targetParticipants} onChange={(v) => set("targetParticipants", v)} />
        <Field label="Project Lead" value={values.projectLead} onChange={(v) => set("projectLead", v)} />
      </Card>

      <Card title="Participation">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Students" type="number" value={values.students} onChange={(v) => set("students", v)} />
          <Field label="Faculty" type="number" value={values.faculty} onChange={(v) => set("faculty", v)} />
          <Field label="Staff / Admin" type="number" value={values.staffAdmin} onChange={(v) => set("staffAdmin", v)} />
          <Field label="Community Members" type="number" value={values.community} onChange={(v) => set("community", v)} />
          <Field label="Total Participants" type="number" value={values.totalParticipants} onChange={(v) => set("totalParticipants", v)} />
          <Field label="School Population" type="number" value={values.schoolPopulation} onChange={(v) => set("schoolPopulation", v)} />
        </div>
        <Field label="Participation Rate (%)" type="number" value={values.participationRate} onChange={(v) => set("participationRate", v)} />
      </Card>

      {error && (
        <p className="text-[13px] font-medium" style={{ color: "var(--danger-fg)" }}>{error}</p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push(`/admin/${reportId}`)}
          className="px-5 py-2.5 rounded-full font-medium text-[13.5px] transition-colors"
          style={{ color: "var(--text-body)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--overlay-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full font-semibold text-[13.5px] transition-all duration-200 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{
            color: "var(--text-inverse)",
            backgroundColor: "var(--brand)",
            boxShadow: "var(--shadow-brand)",
          }}
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-3xl p-6 sm:p-8"
      style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
    >
      <h2
        className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-5"
        style={{ color: "var(--brand-mid)" }}
      >
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label, value, onChange, type = "text", required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className={LABEL_CLS}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={INPUT_CLS}
      />
    </div>
  );
}

function Textarea({
  label, value, onChange, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className={LABEL_CLS}>{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_CLS} resize-none`}
      />
    </div>
  );
}
