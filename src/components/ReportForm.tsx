"use client";

import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import Image from "next/image";
import SchoolAutocomplete from "@/components/SchoolAutocomplete";
import PhoneField from "@/components/PhoneField";
import { SDG_GOALS } from "@/data/sdgs";

// ============================================================================
// EDITABLE CONTENT: edit question wording, add/remove options here
// ============================================================================

const INITIATIVE_TYPES = [
  { key: "energy", label: "Energy Conservation" },
  { key: "water", label: "Water Conservation" },
  { key: "biodiversity", label: "Biodiversity Conservation" },
  { key: "waste", label: "Waste Reduction / Recycling" },
  { key: "education", label: "Environmental Education (e.g., Forum, Seminars)" },
  { key: "cleanup", label: "Clean-Up Drive" },
  { key: "circular", label: "Circular Economy Drive" },
  { key: "other", label: "Other" },
] as const;


const EFFECTIVENESS_CRITERIA = [
  "Organization and planning",
  "Participant engagement",
  "Achievement of intended outcomes",
  "Feasibility and scalability",
  "Overall effectiveness",
];

const BIODIVERSITY_TYPES = [
  { key: "habitat", label: "Habitat Restoration" },
  { key: "species", label: "Native Species Protection" },
  { key: "greening", label: "Campus Greening" },
  { key: "awareness", label: "Wildlife Awareness Campaign" },
];

const EDUCATION_TYPES = [
  { key: "forum", label: "Forum" },
  { key: "seminar", label: "Seminar" },
  { key: "workshop", label: "Workshop" },
  { key: "awareness", label: "Awareness Campaign" },
];

const CLEANUP_AREAS = [
  { key: "campus", label: "Campus" },
  { key: "community", label: "Community" },
  { key: "river", label: "River" },
  { key: "coastal", label: "Coastal" },
  { key: "park", label: "Park" },
  { key: "other", label: "Other" },
];

const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "twitter", label: "X / Twitter" },
  { key: "other", label: "Other" },
];

// Sidebar TOC + section metadata. Reorder here to reorder the sidebar; the form
// itself still follows JSX order below, so move the matching <SectionCard> too.
const SECTIONS = [
  { id: "submitter", num: "1", title: "About you", subtitle: "Just so we know who to thank, and follow up with if needed." },
  { id: "overview", num: "2", title: "What did you do?", subtitle: "The elevator pitch of your project." },
  { id: "participation", num: "3", title: "Who showed up?", subtitle: "Rough numbers are fine. We're not auditing." },
  { id: "impact", num: "4", title: "What changed?", subtitle: "Only what you actually measured. Skip anything that doesn't apply." },
  { id: "effectiveness", num: "5", title: "How'd it go?", subtitle: "1 = rough, 5 = crushed it. Your gut read is fine." },
  { id: "climate", num: "6", title: "Climate literacy", subtitle: "Did participants walk away knowing something new?" },
  { id: "feedback", num: "7", title: "What people said", subtitle: "Quotes, reactions, anything that stuck with you." },
  { id: "digital", num: "8", title: "Where you shared it", subtitle: "Posts, hashtags, photos, links. Whatever you've got." },
  { id: "reflect-gate", num: "9", title: "Want to add a reflection?", subtitle: "The data part is done. Two optional sections left if you'd like to share how it actually went." },
  { id: "lasallian", num: "10", title: "Lasallian reflection", subtitle: "How the mission showed up in the work." },
  { id: "lessons", num: "11", title: "Lessons learned", subtitle: "Honest beats polished. Future campaigns learn from this." },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];
const SECTIONS_MAP = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));
const REFLECT_GATE_INDEX = SECTIONS.findIndex((s) => s.id === "reflect-gate");

const DRAFT_STORAGE_KEY = "lfe-report-draft-v1";

// ============================================================================
// STATE SHAPE: mirrors the email payload one-to-one
// ============================================================================

type YesNo = "" | "Yes" | "No";
type Continuing = "" | "Yes" | "NotYet" | "No";

type Report = {
  submitter: { name: string; role: string; email: string; phone: string };
  overview: {
    schoolName: string;
    projectTitle: string;
    description: string;
    dateImplemented: string;
    projectDuration: string;
    targetParticipants: string;
    projectLead: string;
    initiativeTypes: Record<string, boolean>;
    initiativeOther: string;
    sdgGoals: Record<string, boolean>;
  };
  participation: {
    students: string;
    faculty: string;
    staffAdmin: string;
    total: string;
  };
  impact: {
    energy: { baselineKwh: string; postKwh: string; kwhReduced: string; costSavings: string; unitsParticipating: string };
    water: { baselineWater: string; postWater: string; litersSaved: string; costSavings: string; unitsParticipating: string };
    biodiversity: {
      types: Record<string, boolean>;
      speciesPlanted: string;
      areaRehabilitated: string;
      awarenessActivities: string;
      partnerOrgs: string;
      unitsParticipating: string;
    };
    waste: { baselineKg: string; postKg: string; totalCollected: string; recycledDiverted: string; reductionPct: string; unitsParticipating: string };
    education: { types: Record<string, boolean>; sessions: string; speakers: string; materials: string; attendees: string };
    cleanup: {
      areas: Record<string, boolean>;
      areaOther: string;
      wasteCollected: string;
      areaCleaned: string;
      bagsFilled: string;
      partnerOrgs: string;
      volunteers: string;
    };
    circular: { itemsCollected: string; itemsRedistributed: string; fundsRaised: string; beneficiaryOrgs: string; partnerOrgs: string; volunteers: string };
    otherImpact: string;
  };
  effectiveness: { criteria: string; rating: string; remarks: string }[];
  climateLiteracy: { included: YesNo; description: string };
  participantFeedback: string;
  digitalAdvocacy: {
    platforms: Record<string, boolean>;
    platformOther: string;
    hashtagUsed: YesNo;
    hashtagEffectiveness: string;
    reach: { reactions: string; comments: string; shares: string; views: string };
    postLinks: string;
  };
  lasallianReflection: { spiritOfFaith: string; zealForService: string; communionInMission: string };
  lessons: {
    whatWentWell: string;
    challenges: string;
    recommendations: string;
    districtSuggestions: string;
    continuing: Continuing;
    plannedActivity: string;
    notContinuingReason: string;
  };
  documentationLinks: string;
};

function boolMap(items: readonly { key: string }[]): Record<string, boolean> {
  return Object.fromEntries(items.map((i) => [i.key, false]));
}

const INITIAL: Report = {
  submitter: { name: "", role: "", email: "", phone: "" },
  overview: {
    schoolName: "",
    projectTitle: "",
    description: "",
    dateImplemented: "",
    projectDuration: "",
    targetParticipants: "",
    projectLead: "",
    initiativeTypes: boolMap(INITIATIVE_TYPES),
    initiativeOther: "",
    sdgGoals: boolMap(SDG_GOALS),
  },
  participation: { students: "", faculty: "", staffAdmin: "", total: "" },
  impact: {
    energy: { baselineKwh: "", postKwh: "", kwhReduced: "", costSavings: "", unitsParticipating: "" },
    water: { baselineWater: "", postWater: "", litersSaved: "", costSavings: "", unitsParticipating: "" },
    biodiversity: { types: boolMap(BIODIVERSITY_TYPES), speciesPlanted: "", areaRehabilitated: "", awarenessActivities: "", partnerOrgs: "", unitsParticipating: "" },
    waste: { baselineKg: "", postKg: "", totalCollected: "", recycledDiverted: "", reductionPct: "", unitsParticipating: "" },
    education: { types: boolMap(EDUCATION_TYPES), sessions: "", speakers: "", materials: "", attendees: "" },
    cleanup: { areas: boolMap(CLEANUP_AREAS), areaOther: "", wasteCollected: "", areaCleaned: "", bagsFilled: "", partnerOrgs: "", volunteers: "" },
    circular: { itemsCollected: "", itemsRedistributed: "", fundsRaised: "", beneficiaryOrgs: "", partnerOrgs: "", volunteers: "" },
    otherImpact: "",
  },
  effectiveness: EFFECTIVENESS_CRITERIA.map((criteria) => ({ criteria, rating: "", remarks: "" })),
  climateLiteracy: { included: "", description: "" },
  participantFeedback: "",
  digitalAdvocacy: {
    platforms: boolMap(SOCIAL_PLATFORMS),
    platformOther: "",
    hashtagUsed: "",
    hashtagEffectiveness: "",
    reach: { reactions: "", comments: "", shares: "", views: "" },
    postLinks: "",
  },
  lasallianReflection: { spiritOfFaith: "", zealForService: "", communionInMission: "" },
  lessons: { whatWentWell: "", challenges: "", recommendations: "", districtSuggestions: "", continuing: "", plannedActivity: "", notContinuingReason: "" },
  documentationLinks: "",
};

// Path-based state reducer. `set("overview.schoolName", "Foo")` walks the object.
// Adding/removing/renaming a field means editing INITIAL + the field's JSX line; no per-field handler needed.
type Action = { type: "SET"; path: string; value: unknown } | { type: "RESET" };

function reducer(state: Report, action: Action): Report {
  if (action.type === "RESET") return INITIAL;
  const parts = action.path.split(".");
  const clone = structuredClone(state) as Report;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ref: any = clone;
  for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]];
  ref[parts[parts.length - 1]] = action.value;
  return clone;
}

// ============================================================================
// PRIMITIVE INPUTS: shared styling lives here. Change once, updates everywhere.
// ============================================================================

const INPUT_CLS =
  "w-full border border-[color:var(--border-input)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-[color:var(--border-input-focus)] transition";
const LABEL_CLS = "block text-sm font-medium mb-1.5";

type SetFn = (path: string, value: unknown) => void;

function Field({
  label, path, value, onChange, type = "text", placeholder, required, hint, readOnly, min,
}: {
  label: string; path: string; value: string; onChange: SetFn;
  type?: string; placeholder?: string; required?: boolean; hint?: string;
  readOnly?: boolean; min?: number | string;
}) {
  return (
    <div>
      <label className={LABEL_CLS} style={{ color: "var(--text-body)" }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(path, e.target.value)}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        min={min}
        className={`${INPUT_CLS}${readOnly ? " cursor-not-allowed" : ""}`}
        style={{
          backgroundColor: readOnly ? "var(--surface-sunken)" : "var(--surface)",
          color: readOnly ? "var(--text-muted)" : "var(--text-primary)",
        }}
      />
      {hint && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{hint}</p>}
    </div>
  );
}

function wordCount(s: string): number {
  const t = s.trim();
  return t === "" ? 0 : t.split(/\s+/).length;
}

function Textarea({
  label, path, value, onChange, rows = 3, placeholder, required, hint, maxWords,
}: {
  label: string; path: string; value: string; onChange: SetFn;
  rows?: number; placeholder?: string; required?: boolean; hint?: string;
  maxWords?: number;
}) {
  const count = maxWords ? wordCount(value) : 0;
  const over = maxWords ? count > maxWords : false;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value;
    if (maxWords && wordCount(v) > maxWords) {
      // Truncate to the first maxWords words (handles paste of long text).
      const truncated = v.trim().split(/\s+/).slice(0, maxWords).join(" ");
      onChange(path, truncated);
    } else {
      onChange(path, v);
    }
  }

  return (
    <div>
      <label className={LABEL_CLS} style={{ color: "var(--text-body)" }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className={`${INPUT_CLS} resize-none`}
        style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
      />
      <div className="flex items-start justify-between mt-1 gap-3">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>
        {maxWords && (
          <p
            className={`text-xs shrink-0 ${over ? "font-semibold" : ""}`}
            style={{ color: over ? "var(--danger-fg)" : "var(--text-subtle)" }}
          >
            {count} / {maxWords} words
          </p>
        )}
      </div>
    </div>
  );
}

// Tailwind's static scan can't parse dynamic class strings, so hardcode the grid classes.
const CHECKBOX_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

function CheckboxGroup({
  label, options, basePath, values, onChange, cols = 2,
}: {
  label: string;
  options: readonly { key: string; label: string }[];
  basePath: string;
  values: Record<string, boolean>;
  onChange: SetFn;
  cols?: 1 | 2 | 3 | 4;
}) {
  return (
    <div>
      <label className={LABEL_CLS} style={{ color: "var(--text-body)" }}>{label}</label>
      <div className={`grid ${CHECKBOX_COLS[cols]} gap-2`}>
        {options.map((opt) => (
          <label
            key={opt.key}
            className="flex items-center gap-2 text-sm cursor-pointer"
            style={{ color: "var(--text-body)" }}
          >
            <input
              type="checkbox"
              checked={!!values[opt.key]}
              onChange={(e) => onChange(`${basePath}.${opt.key}`, e.target.checked)}
              className="w-4 h-4 accent-green-700"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

// Card-tile picker for the 17 SDGs. Each tile stacks a large square SDG image
// over the goal title. Selection state is signaled by a colored ring + tint.
function SdgPicker({
  label, basePath, values, onChange,
}: {
  label: string;
  basePath: string;
  values: Record<string, boolean>;
  onChange: SetFn;
}) {
  const selectedCount = Object.values(values).filter(Boolean).length;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 gap-3">
        <label className="block text-sm font-medium" style={{ color: "var(--text-body)" }}>{label}</label>
        <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
          {selectedCount} selected
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {SDG_GOALS.map((g) => {
          const checked = !!values[g.key];
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => onChange(`${basePath}.${g.key}`, !checked)}
              aria-pressed={checked}
              className={`group relative flex flex-col text-left rounded-xl overflow-hidden border transition-all ${
                checked ? "border-transparent shadow-sm" : ""
              }`}
              style={
                checked
                  ? { backgroundColor: `${g.color}14`, boxShadow: `inset 0 0 0 2px ${g.color}` }
                  : { backgroundColor: "var(--surface)", borderColor: "var(--border-input)" }
              }
              onMouseEnter={(e) => {
                if (!checked) e.currentTarget.style.backgroundColor = "var(--overlay-hover)";
              }}
              onMouseLeave={(e) => {
                if (!checked) e.currentTarget.style.backgroundColor = "var(--surface)";
              }}
            >
              <span
                className="relative block w-full aspect-square"
                style={{ backgroundColor: g.color }}
              >
                <Image
                  src={`/sdg/sdg-${String(g.num).padStart(2, "0")}.png`}
                  alt={`SDG ${g.num}: ${g.title}`}
                  fill
                  sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 45vw"
                  className="object-cover"
                />
                <span
                  className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-opacity ${
                    checked ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ backgroundColor: g.color, color: "var(--text-inverse)", boxShadow: "0 0 0 2px var(--surface)" }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6.5L5 9l4.5-5" />
                  </svg>
                </span>
              </span>
              <span
                className="px-2.5 py-2 text-[12px] sm:text-[13px] font-medium leading-snug"
                style={{ color: "var(--text-primary)" }}
              >
                {g.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RadioGroup({
  label, options, path, value, onChange,
}: {
  label: string;
  options: readonly { key: string; label: string }[];
  path: string;
  value: string;
  onChange: SetFn;
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
              onChange={() => onChange(path, opt.key)}
              className="w-4 h-4 accent-green-700"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function RatingScale({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { v: "1", label: "Poor" },
    { v: "2", label: "" },
    { v: "3", label: "OK" },
    { v: "4", label: "" },
    { v: "5", label: "Excellent" },
  ];
  return (
    <div className="flex items-stretch gap-1.5" role="radiogroup" aria-label="Rating">
      {options.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.v)}
            className="flex-1 min-w-0 rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 hover:-translate-y-px"
            style={{
              backgroundColor: active ? "var(--brand)" : "var(--surface-accent)",
              color: active ? "var(--text-inverse)" : "var(--brand)",
              boxShadow: active ? "var(--shadow-brand)" : "inset 0 0 0 1px var(--border-brand)",
            }}
          >
            <div className="text-base leading-none">{o.v}</div>
            {o.label && (
              <div
                className="text-[10px] font-medium mt-1 tracking-wider uppercase leading-none"
                style={{ opacity: active ? 0.9 : 0.7 }}
              >
                {o.label}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Wizard context: SectionCard reads currentStep from here to decide if it renders.
const StepContext = createContext<{
  currentStep: number;
  direction: 1 | -1;
  goTo: (n: number) => void;
}>({ currentStep: 0, direction: 1, goTo: () => {} });

function useStep() {
  return useContext(StepContext);
}

function SectionCard({
  id, children,
}: {
  id: SectionId;
  children: React.ReactNode;
}) {
  const { currentStep, direction } = useStep();
  const idx = SECTIONS.findIndex((s) => s.id === id);
  if (idx !== currentStep) return null;

  const meta = SECTIONS_MAP[id];
  return (
    <section
      id={id}
      data-section-id={id}
      className={`rounded-3xl p-6 sm:p-10 ${
        direction === 1 ? "lfe-slide-right" : "lfe-slide-left"
      }`}
      style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="mb-8">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-2"
          style={{ color: "var(--brand-mid)" }}
        >
          Section {meta.num} of {SECTIONS.length}
        </p>
        <h3
          className="text-2xl sm:text-3xl font-bold tracking-tight leading-[1.1]"
          style={{ color: "var(--text-heading)" }}
        >
          {meta.title}
        </h3>
        {"subtitle" in meta && meta.subtitle && (
          <p className="text-[15px] mt-3 leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>{meta.subtitle}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

// Wraps a conditional Impact Evaluation sub-block in a bordered green panel
// so multiple selected initiative types don't visually blur together.
function ImpactPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="border rounded-xl p-5"
      style={{ borderColor: "var(--border-brand-soft)", backgroundColor: "var(--surface-accent)" }}
    >
      <h4 className="font-semibold mb-4" style={{ color: "var(--brand-mid)" }}>{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}


const YESNO_OPTIONS = [
  { key: "Yes", label: "Yes" },
  { key: "No", label: "No" },
];

const CONTINUING_OPTIONS = [
  { key: "Yes", label: "Yes" },
  { key: "NotYet", label: "Not yet determined" },
  { key: "No", label: "No" },
];

// ============================================================================
// MAIN FORM
// ============================================================================

type Status = "idle" | "loading" | "success" | "error";

type ReportFormProps = {
  initialSubmitter?: { name?: string; email?: string };
  signInAction?: () => Promise<void>;
  signOutAction?: () => Promise<void>;
};

export default function ReportForm({ initialSubmitter, signInAction, signOutAction }: ReportFormProps = {}) {
  const isSignedIn = Boolean(initialSubmitter?.email);
  const seededInitial: Report = initialSubmitter
    ? {
        ...INITIAL,
        submitter: {
          ...INITIAL.submitter,
          name: initialSubmitter.name ?? "",
          email: initialSubmitter.email ?? "",
        },
      }
    : INITIAL;
  const [form, dispatch] = useReducer(reducer, seededInitial);
  const emailLocked = Boolean(initialSubmitter?.email);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [consented, setConsented] = useState(false);
  const [skipReflection, setSkipReflection] = useState(false);
  const [draftState, setDraftState] = useState<"idle" | "saving" | "saved">("idle");
  const draftLoadedRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set: SetFn = (path, value) => dispatch({ type: "SET", path, value });
  const totalSteps = SECTIONS.length;
  // When the user opts out of reflection, the gate step becomes the final step.
  const isLastStep =
    (skipReflection && currentStep === REFLECT_GATE_INDEX) ||
    currentStep === totalSteps - 1;
  // Only steps up to (and including) the gate count when the user is skipping.
  const effectiveTotalSteps = skipReflection ? REFLECT_GATE_INDEX + 1 : totalSteps;

  // Restore draft on first mount. When signed in, the server draft is truth
  // (so a coordinator can move between devices); localStorage is truth
  // otherwise. On first sign-in with an anonymous local draft, we upload it.
  useEffect(() => {
    let cancelled = false;

    function applyDraft(parsed: { form?: Record<string, unknown>; step?: unknown; skipReflection?: unknown }) {
      if (parsed?.form && typeof parsed.form === "object") {
        Object.keys(parsed.form).forEach((k) => {
          dispatch({ type: "SET", path: k, value: (parsed.form as Record<string, unknown>)[k] });
        });
      }
      if (typeof parsed?.step === "number") {
        const maxStep = SECTIONS.length - 1;
        setCurrentStep(Math.max(0, Math.min(parsed.step, maxStep)));
      }
      if (typeof parsed?.skipReflection === "boolean") {
        setSkipReflection(parsed.skipReflection);
      }
    }

    function readLocal(): { form?: Record<string, unknown>; step?: unknown; skipReflection?: unknown } | null {
      try {
        const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }

    async function load() {
      let restored: { form?: Record<string, unknown>; step?: unknown; skipReflection?: unknown } | null = null;

      if (isSignedIn) {
        try {
          const res = await fetch("/api/report/draft", { cache: "no-store" });
          if (res.ok) {
            const body = await res.json();
            if (body?.draft) restored = body.draft;
          }
        } catch { /* offline or network error; fall back to local */ }

        if (!restored) {
          // No server draft yet; promote the local draft if we have one.
          const local = readLocal();
          if (local) {
            restored = local;
            try {
              await fetch("/api/report/draft", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(local),
              });
            } catch { /* best effort */ }
          }
        }
      } else {
        restored = readLocal();
      }

      if (cancelled) return;

      if (restored) {
        applyDraft(restored);
        setDraftState("saved");
      }
      // Signed-in identity always wins over any draft value so a stale draft
      // can't spoof the submitter (server-side we also override with session).
      if (initialSubmitter?.email) {
        dispatch({ type: "SET", path: "submitter.email", value: initialSubmitter.email });
      }
      if (initialSubmitter?.name) {
        dispatch({ type: "SET", path: "submitter.name", value: initialSubmitter.name });
      }
      draftLoadedRef.current = true;
    }

    load();
    return () => { cancelled = true; };
  }, [isSignedIn, initialSubmitter?.email, initialSubmitter?.name]);

  // Debounced autosave. Always writes localStorage; also PUTs to the server
  // when signed in so drafts survive across devices.
  useEffect(() => {
    if (!draftLoadedRef.current) return;
    setDraftState("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const payload = { form, step: currentStep, skipReflection };
    saveTimerRef.current = setTimeout(async () => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
      } catch { /* storage may be full or disabled */ }
      if (isSignedIn) {
        try {
          await fetch("/api/report/draft", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch { /* offline; localStorage still holds the draft */ }
      }
      setDraftState("saved");
    }, 1200);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [form, currentStep, skipReflection, isSignedIn]);

  function goTo(n: number) {
    if (n < 0 || n >= totalSteps) return;
    setDirection(n > currentStep ? 1 : -1);
    setCurrentStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext() {
    // Only fields on the visible step are in the DOM, so native form validation
    // naturally scopes to the current step.
    const nativeForm = document.getElementById("lfe-report-form") as HTMLFormElement | null;
    if (nativeForm && !nativeForm.reportValidity()) return;
    goTo(currentStep + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
      dispatch({ type: "RESET" });
      setCurrentStep(0);
      setConsented(false);
      setSkipReflection(false);
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch { /* ignore */ }
      if (isSignedIn) {
        fetch("/api/report/draft", { method: "DELETE" }).catch(() => { /* best effort */ });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <section style={{ backgroundColor: "var(--surface-page)" }} className="py-24 min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto px-6 w-full">
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-3" style={{ color: "var(--brand-mid)" }}>
              Report received
            </p>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--text-heading)" }}>
              Thanks for showing up.
            </h3>
            <p className="text-[16px] mb-10 max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Your report is now part of the district-wide record. The LEADForEarth committee will reach out if we have follow-up questions.
            </p>

            <div className="text-left mb-10 grid gap-3 sm:grid-cols-3 max-w-lg mx-auto">
              <NextStep n="1" label="Confirmation" text="A copy is on its way to your email." />
              <NextStep n="2" label="Review" text="The committee will review your report." />
              <NextStep n="3" label="Aggregation" text="It joins the district's annual impact summary." />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setStatus("idle")}
                className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
                style={{ backgroundColor: "var(--brand)", color: "var(--text-inverse)", boxShadow: "var(--shadow-brand-strong)" }}
              >
                Submit another report
              </button>
              <a
                href="/"
                className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
                style={{
                  color: "var(--brand)",
                  backgroundColor: "transparent",
                  boxShadow: "inset 0 0 0 1.5px var(--border-brand)",
                }}
              >
                Back to home
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentMeta = SECTIONS[currentStep];
  const percentComplete = Math.round(((currentStep + 1) / effectiveTotalSteps) * 100);

  return (
    <StepContext.Provider value={{ currentStep, direction, goTo }}>
    <section style={{ backgroundColor: "var(--surface-page)" }} className="py-10 sm:py-14 pb-32 md:pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Compact header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-3" style={{ color: "var(--brand-mid)" }}>
            #LEADforEarth Report
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "var(--text-heading)" }}>
            Tell us what you did
          </h2>
          <p className="leading-relaxed max-w-lg mx-auto text-[15px] font-light" style={{ color: "var(--text-muted)" }}>
            Skip anything that doesn&apos;t apply. Take a break whenever. Your progress saves as you go.
          </p>
          {/* Preview link so first-time submitters can see the finished shape
              of a report before diving into the form. */}
          <div className="mt-4 flex justify-center">
            <a
              href="/reports/example"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--brand-mid)" }}
            >
              See what a submitted report looks like
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>

        {/* Anonymous-mode banner: shown until the user signs in on submit. */}
        {!isSignedIn && signInAction && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 flex items-start gap-3"
            style={{ backgroundColor: "var(--surface-accent)", color: "var(--text-heading)" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-none mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <div className="flex-1 text-[13.5px] leading-snug">
              <p className="font-semibold mb-0.5">Browsing without an account</p>
              <p style={{ color: "var(--text-body)" }}>
                Fill in as much as you like. We&apos;ll ask you to sign in with Google when you&apos;re ready to submit. Progress is saved on this device.
              </p>
            </div>
          </div>
        )}

        {/* Hidden form used by the "Sign in to submit" button (server action).
            Kept outside the main form because HTML forms can't nest. */}
        {!isSignedIn && signInAction && (
          <form id="lfe-signin-form" action={signInAction} className="hidden" />
        )}

        {/* Compact progress: bar + step counter + draft status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-[13px] font-semibold" style={{ color: "var(--text-heading)" }}>
              Step {currentStep + 1} of {effectiveTotalSteps}
              <span className="ml-2 font-normal" style={{ color: "var(--text-muted)" }}>· {currentMeta.title}</span>
            </p>
            <p className="text-[11px] font-medium flex items-center gap-1.5" style={{ color: draftState === "saving" ? "var(--text-subtle)" : "var(--brand-mid)" }} aria-live="polite">
              {draftState === "saving" ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--text-subtle)" }} />
                  Saving…
                </>
              ) : draftState === "saved" ? (
                <>
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Draft saved
                </>
              ) : null}
            </p>
          </div>

          {/* Progress bar */}
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--overlay-brand-hover)" }}
            role="progressbar"
            aria-valuenow={percentComplete}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${percentComplete}%`,
                backgroundColor: "var(--brand)",
              }}
            />
          </div>

          {/* Step dots (jump nav, compact) */}
          <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
            {SECTIONS.map((s, i) => {
              const state = currentStep === i ? "current" : currentStep > i ? "done" : "todo";
              const willBeSkipped = skipReflection && i > REFLECT_GATE_INDEX;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  disabled={willBeSkipped}
                  title={
                    willBeSkipped
                      ? `${s.title} (skipped)`
                      : `Step ${i + 1}: ${s.title}`
                  }
                  aria-label={`Go to step ${i + 1}: ${s.title}`}
                  aria-current={state === "current" ? "step" : undefined}
                  className="rounded-full transition-all duration-200 hover:scale-110 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  style={{
                    width: state === "current" ? 24 : 8,
                    height: 8,
                    backgroundColor: state === "todo" ? "var(--border-input)" : "var(--brand)",
                    opacity: willBeSkipped ? 0.25 : state === "done" ? 0.55 : 1,
                  }}
                />
              );
            })}
          </div>
        </div>

        {status === "error" && (
          <div
            className="mb-5 px-4 py-3 rounded-xl border text-sm"
            style={{
              backgroundColor: "var(--danger-bg)",
              borderColor: "var(--danger-border)",
              color: "var(--danger-fg)",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form id="lfe-report-form" onSubmit={handleSubmit}>
          {/* -------- Submitter -------- */}
          <SectionCard id="submitter">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" path="submitter.name" value={form.submitter.name} onChange={set} required placeholder="Juan Dela Cruz" />
              <Field label="Role / Position" path="submitter.role" value={form.submitter.role} onChange={set} required placeholder="Sustainability Officer" />
            </div>
            <Field
              label="Email Address"
              path="submitter.email"
              type="email"
              value={form.submitter.email}
              onChange={set}
              required
              placeholder="you@school.edu.ph"
              readOnly={emailLocked}
              hint={emailLocked ? "From your Google sign-in. Used to verify the submission." : undefined}
            />
            <PhoneField label="Phone (optional)" path="submitter.phone" value={form.submitter.phone} onChange={set} />
            {emailLocked && signOutAction && (
              <p className="text-xs pt-1" style={{ color: "var(--text-muted)" }}>
                Not your Google account?{" "}
                <button
                  type="button"
                  onClick={() => signOutAction()}
                  className="font-semibold underline underline-offset-2 hover:no-underline transition-colors"
                  style={{ color: "var(--brand)" }}
                >
                  Log out and switch here
                </button>
              </p>
            )}
          </SectionCard>

          {/* -------- I. Project Overview -------- */}
          <SectionCard id="overview">
            <SchoolAutocomplete
              label="School Name"
              path="overview.schoolName"
              value={form.overview.schoolName}
              onChange={set}
              required
              placeholder="Start typing your school…"
              hint="Start typing your school and pick from the list. Only Lasallian East Asia District schools can submit reports."
            />
            <Field label="Project Title" path="overview.projectTitle" value={form.overview.projectTitle} onChange={set} required placeholder="[Title of Project]" />
            <Textarea
              label="Brief Description of Activity"
              path="overview.description"
              value={form.overview.description}
              onChange={set}
              rows={4}
              maxWords={250}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Date Implemented" path="overview.dateImplemented" type="date" value={form.overview.dateImplemented} onChange={set} />
              <Field label="Project Duration" path="overview.projectDuration" value={form.overview.projectDuration} onChange={set} placeholder="e.g., 1 week" />
            </div>
            <Field label="Target Participants" path="overview.targetParticipants" value={form.overview.targetParticipants} onChange={set} />
            <Field label="Project Lead (organization or department)" path="overview.projectLead" value={form.overview.projectLead} onChange={set} />

            <CheckboxGroup
              label="Type of Initiative (check all that apply)"
              options={INITIATIVE_TYPES}
              basePath="overview.initiativeTypes"
              values={form.overview.initiativeTypes}
              onChange={set}
            />
            {form.overview.initiativeTypes.other && (
              <Field label="Please specify" path="overview.initiativeOther" value={form.overview.initiativeOther} onChange={set} />
            )}

            <SdgPicker
              label="Alignment with the SDGs (check all that apply)"
              basePath="overview.sdgGoals"
              values={form.overview.sdgGoals}
              onChange={set}
            />
          </SectionCard>

          {/* -------- II. Participation Data -------- */}
          <SectionCard id="participation">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Number of Students" path="participation.students" type="number" min={0} value={form.participation.students} onChange={set} />
              <Field label="Number of Faculty" path="participation.faculty" type="number" min={0} value={form.participation.faculty} onChange={set} />
              <Field label="Staff, Associates, and Administration" path="participation.staffAdmin" type="number" min={0} value={form.participation.staffAdmin} onChange={set} />
              <Field label="Total Number of Participants" path="participation.total" type="number" min={0} value={form.participation.total} onChange={set} />
            </div>
          </SectionCard>

          {/* -------- III. Environmental Impact Evaluation -------- */}
          <SectionCard id="impact">
            {!Object.values(form.overview.initiativeTypes).some(Boolean) && (
              <div
                className="text-sm border rounded-xl px-4 py-3"
                style={{
                  color: "var(--text-muted)",
                  backgroundColor: "var(--surface-sunken)",
                  borderColor: "var(--border-input)",
                }}
              >
                Nothing to fill in here yet. If your activity fits one of the initiative types in Project Overview, pick it there to see the matching indicators. Otherwise, feel free to continue.
              </div>
            )}

            {form.overview.initiativeTypes.energy && (
              <ImpactPanel title="Energy Conservation">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Baseline: 1 month before (kWh)" path="impact.energy.baselineKwh" type="number" min={0} value={form.impact.energy.baselineKwh} onChange={set} />
                  <Field label="Post-activity: 1 month after (kWh)" path="impact.energy.postKwh" type="number" min={0} value={form.impact.energy.postKwh} onChange={set} />
                  <Field label="kWh Reduced" path="impact.energy.kwhReduced" type="number" min={0} value={form.impact.energy.kwhReduced} onChange={set} />
                  <Field label="Estimated Cost Savings" path="impact.energy.costSavings" value={form.impact.energy.costSavings} onChange={set} placeholder="₱" />
                  <Field label="Classrooms/Offices/Departments Participating" path="impact.energy.unitsParticipating" type="number" min={0} value={form.impact.energy.unitsParticipating} onChange={set} />
                </div>
              </ImpactPanel>
            )}

            {form.overview.initiativeTypes.water && (
              <ImpactPanel title="Water Conservation">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Baseline: 1 month before (liter / m³)" path="impact.water.baselineWater" value={form.impact.water.baselineWater} onChange={set} />
                  <Field label="Post-activity: 1 month after (liter / m³)" path="impact.water.postWater" value={form.impact.water.postWater} onChange={set} />
                  <Field label="Estimated Liters Saved" path="impact.water.litersSaved" type="number" min={0} value={form.impact.water.litersSaved} onChange={set} />
                  <Field label="Estimated Cost Savings" path="impact.water.costSavings" value={form.impact.water.costSavings} onChange={set} placeholder="₱" />
                  <Field label="Classrooms/Offices/Departments Participating" path="impact.water.unitsParticipating" type="number" min={0} value={form.impact.water.unitsParticipating} onChange={set} />
                </div>
              </ImpactPanel>
            )}

            {form.overview.initiativeTypes.biodiversity && (
              <ImpactPanel title="Biodiversity Conservation">
                <CheckboxGroup
                  label="Type of Activity"
                  options={BIODIVERSITY_TYPES}
                  basePath="impact.biodiversity.types"
                  values={form.impact.biodiversity.types}
                  onChange={set}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Native Species Planted/Protected" path="impact.biodiversity.speciesPlanted" type="number" min={0} value={form.impact.biodiversity.speciesPlanted} onChange={set} />
                  <Field label="Area Rehabilitated (sqm / hectares)" path="impact.biodiversity.areaRehabilitated" value={form.impact.biodiversity.areaRehabilitated} onChange={set} />
                  <Field label="Awareness Activities Conducted" path="impact.biodiversity.awarenessActivities" type="number" min={0} value={form.impact.biodiversity.awarenessActivities} onChange={set} />
                  <Field label="Partner Organizations" path="impact.biodiversity.partnerOrgs" value={form.impact.biodiversity.partnerOrgs} onChange={set} />
                  <Field label="Classrooms/Offices/Departments Participating" path="impact.biodiversity.unitsParticipating" type="number" min={0} value={form.impact.biodiversity.unitsParticipating} onChange={set} />
                </div>
              </ImpactPanel>
            )}

            {form.overview.initiativeTypes.waste && (
              <ImpactPanel title="Waste Reduction / Recycling">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Baseline: 1 month before (kg)" path="impact.waste.baselineKg" type="number" min={0} value={form.impact.waste.baselineKg} onChange={set} />
                  <Field label="Post-activity: 1 month after (kg)" path="impact.waste.postKg" type="number" min={0} value={form.impact.waste.postKg} onChange={set} />
                  <Field label="Total Waste Collected (kg)" path="impact.waste.totalCollected" type="number" min={0} value={form.impact.waste.totalCollected} onChange={set} />
                  <Field label="Waste Recycled / Diverted (kg)" path="impact.waste.recycledDiverted" type="number" min={0} value={form.impact.waste.recycledDiverted} onChange={set} />
                  <Field label="Reduction in Waste Generation (%)" path="impact.waste.reductionPct" type="number" min={0} value={form.impact.waste.reductionPct} onChange={set} />
                  <Field label="Classrooms/Offices/Departments Participating" path="impact.waste.unitsParticipating" type="number" min={0} value={form.impact.waste.unitsParticipating} onChange={set} />
                </div>
              </ImpactPanel>
            )}

            {form.overview.initiativeTypes.education && (
              <ImpactPanel title="Environmental Education">
                <CheckboxGroup
                  label="Type of Activity"
                  options={EDUCATION_TYPES}
                  basePath="impact.education.types"
                  values={form.impact.education.types}
                  onChange={set}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Sessions Conducted" path="impact.education.sessions" type="number" min={0} value={form.impact.education.sessions} onChange={set} />
                  <Field label="Speakers / Resource Persons" path="impact.education.speakers" type="number" min={0} value={form.impact.education.speakers} onChange={set} />
                  <Field label="Educational Materials Distributed" path="impact.education.materials" type="number" min={0} value={form.impact.education.materials} onChange={set} />
                  <Field label="Attendees" path="impact.education.attendees" type="number" min={0} value={form.impact.education.attendees} onChange={set} />
                </div>
              </ImpactPanel>
            )}

            {form.overview.initiativeTypes.cleanup && (
              <ImpactPanel title="Clean-Up Drive">
                <CheckboxGroup
                  label="Area of Clean-Up Activity"
                  options={CLEANUP_AREAS}
                  basePath="impact.cleanup.areas"
                  values={form.impact.cleanup.areas}
                  onChange={set}
                  cols={3}
                />
                {form.impact.cleanup.areas.other && (
                  <Field label="Please specify" path="impact.cleanup.areaOther" value={form.impact.cleanup.areaOther} onChange={set} />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Total Waste Collected (kg)" path="impact.cleanup.wasteCollected" type="number" min={0} value={form.impact.cleanup.wasteCollected} onChange={set} />
                  <Field label="Area Cleaned (sqm / hectares)" path="impact.cleanup.areaCleaned" value={form.impact.cleanup.areaCleaned} onChange={set} />
                  <Field label="Trash Bags Filled" path="impact.cleanup.bagsFilled" type="number" min={0} value={form.impact.cleanup.bagsFilled} onChange={set} />
                  <Field label="Partner Organizations" path="impact.cleanup.partnerOrgs" value={form.impact.cleanup.partnerOrgs} onChange={set} />
                  <Field label="Volunteers Involved" path="impact.cleanup.volunteers" type="number" min={0} value={form.impact.cleanup.volunteers} onChange={set} />
                </div>
              </ImpactPanel>
            )}

            {form.overview.initiativeTypes.circular && (
              <ImpactPanel title="Circular Economy Drive">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Donated Items Collected" path="impact.circular.itemsCollected" type="number" min={0} value={form.impact.circular.itemsCollected} onChange={set} />
                  <Field label="Items Sold / Redistributed" path="impact.circular.itemsRedistributed" type="number" min={0} value={form.impact.circular.itemsRedistributed} onChange={set} />
                  <Field label="Funds Raised" path="impact.circular.fundsRaised" value={form.impact.circular.fundsRaised} onChange={set} placeholder="₱" />
                  <Field label="Beneficiary Organization(s)" path="impact.circular.beneficiaryOrgs" value={form.impact.circular.beneficiaryOrgs} onChange={set} />
                  <Field label="Partner Organizations" path="impact.circular.partnerOrgs" value={form.impact.circular.partnerOrgs} onChange={set} />
                  <Field label="Volunteers Involved" path="impact.circular.volunteers" type="number" min={0} value={form.impact.circular.volunteers} onChange={set} />
                </div>
              </ImpactPanel>
            )}

            {form.overview.initiativeTypes.other && (
              <ImpactPanel title="Other Environmental Actions">
                <Textarea
                  label="Impact Indicators Used"
                  path="impact.otherImpact"
                  value={form.impact.otherImpact}
                  onChange={set}
                  rows={4}
                />
              </ImpactPanel>
            )}
          </SectionCard>

          {/* -------- V. Effectiveness of Implementation -------- */}
          <SectionCard id="effectiveness">
            {form.effectiveness.map((c, i) => (
              <div
                key={i}
                className="pb-6 border-b last:border-0 last:pb-0"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <p className="text-[15px] font-medium mb-3" style={{ color: "var(--text-primary)" }}>{c.criteria}</p>
                <RatingScale
                  value={c.rating}
                  onChange={(v) => set(`effectiveness.${i}.rating`, v)}
                />
                <input
                  type="text"
                  value={c.remarks}
                  onChange={(e) => set(`effectiveness.${i}.remarks`, e.target.value)}
                  placeholder="Add a short remark (optional)"
                  className={`${INPUT_CLS} mt-3`}
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
                />
              </div>
            ))}
          </SectionCard>

          {/* -------- VI. Climate Literacy and Reflection -------- */}
          <SectionCard id="climate">
            <RadioGroup
              label="Did the initiative include pre-event educational sessions and post-event reflection sessions?"
              options={YESNO_OPTIONS}
              path="climateLiteracy.included"
              value={form.climateLiteracy.included}
              onChange={set}
            />
            {form.climateLiteracy.included === "Yes" && (
              <Textarea
                label="If yes, briefly describe"
                path="climateLiteracy.description"
                value={form.climateLiteracy.description}
                onChange={set}
                rows={3}
              />
            )}
          </SectionCard>

          {/* -------- VII. Participant Feedback -------- */}
          <SectionCard id="feedback">
            <Textarea
              label="Key Insights"
              path="participantFeedback"
              value={form.participantFeedback}
              onChange={set}
              rows={6}
              hint="Provide 3–5 key insights gathered from participants: experiences, learnings, reflections, or feedback."
            />
          </SectionCard>

          {/* -------- VIII. Digital Advocacy Impact -------- */}
          <SectionCard id="digital">
            <CheckboxGroup
              label="Social Media Platform Used"
              options={SOCIAL_PLATFORMS}
              basePath="digitalAdvocacy.platforms"
              values={form.digitalAdvocacy.platforms}
              onChange={set}
              cols={3}
            />
            {form.digitalAdvocacy.platforms.other && (
              <Field label="Please specify" path="digitalAdvocacy.platformOther" value={form.digitalAdvocacy.platformOther} onChange={set} />
            )}

            <RadioGroup
              label="Was the #LEADforEarth hashtag used?"
              options={YESNO_OPTIONS}
              path="digitalAdvocacy.hashtagUsed"
              value={form.digitalAdvocacy.hashtagUsed}
              onChange={set}
            />

            <Textarea
              label="Hashtag Effectiveness / Suggestions"
              path="digitalAdvocacy.hashtagEffectiveness"
              value={form.digitalAdvocacy.hashtagEffectiveness}
              onChange={set}
              rows={3}
              hint="If yes, briefly explain effectiveness. May also be used for suggestions and improvements."
            />

            <div>
              <label className={LABEL_CLS} style={{ color: "var(--text-body)" }}>Campaign Reach</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <input
                  type="number"
                  min={0}
                  placeholder="Reactions / Likes"
                  className={INPUT_CLS}
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
                  value={form.digitalAdvocacy.reach.reactions}
                  onChange={(e) => set("digitalAdvocacy.reach.reactions", e.target.value)}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Comments"
                  className={INPUT_CLS}
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
                  value={form.digitalAdvocacy.reach.comments}
                  onChange={(e) => set("digitalAdvocacy.reach.comments", e.target.value)}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Shares / Reposts"
                  className={INPUT_CLS}
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
                  value={form.digitalAdvocacy.reach.shares}
                  onChange={(e) => set("digitalAdvocacy.reach.shares", e.target.value)}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Reach / Views"
                  className={INPUT_CLS}
                  style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
                  value={form.digitalAdvocacy.reach.views}
                  onChange={(e) => set("digitalAdvocacy.reach.views", e.target.value)}
                />
              </div>
            </div>

            <Textarea
              label="Official Post Links"
              path="digitalAdvocacy.postLinks"
              value={form.digitalAdvocacy.postLinks}
              onChange={set}
              rows={4}
              placeholder="One URL per line"
            />

            <Textarea
              label="Photo / Documentation Links"
              path="documentationLinks"
              value={form.documentationLinks}
              onChange={set}
              rows={4}
              placeholder="One URL per line"
              hint="Optional. Paste links to photos, event pages, or supporting docs."
            />
          </SectionCard>

          {/* -------- Reflection gate: opt in/out of the last two sections -------- */}
          <SectionCard id="reflect-gate">
            <div
              className="rounded-2xl px-6 py-5 text-[14px] leading-relaxed"
              style={{ backgroundColor: "var(--surface-accent)", color: "var(--text-body)" }}
            >
              <p className="font-semibold mb-1.5" style={{ color: "var(--brand)" }}>
                Nice work, that&apos;s the data covered.
              </p>
              <p>
                Two optional sections left: <strong>Lasallian Reflection</strong> and{" "}
                <strong>Lessons Learned</strong>. They&apos;re where you tell the story behind the numbers, and the committee actually reads them.
              </p>
            </div>

            <p className="text-[15px] font-medium pt-2" style={{ color: "var(--text-primary)" }}>
              Do you want to provide your own reflection?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSkipReflection(false);
                  goTo(currentStep + 1);
                }}
                className="text-left rounded-2xl p-5 border transition-all hover:-translate-y-px"
                style={{
                  backgroundColor: !skipReflection ? "var(--surface-accent)" : "var(--surface)",
                  borderColor: !skipReflection ? "var(--brand)" : "var(--border-input)",
                  boxShadow: !skipReflection ? "var(--shadow-brand)" : "none",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--brand)", color: "var(--text-inverse)" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <p
                    className="font-semibold text-[15px]"
                    style={{ color: "var(--text-heading)" }}
                  >
                    Yeah, I&apos;ve got more to say
                  </p>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-body)" }}>
                  Two more short sections and you&apos;re done.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSkipReflection(true)}
                className="text-left rounded-2xl p-5 border transition-all hover:-translate-y-px"
                style={{
                  backgroundColor: skipReflection ? "var(--surface-accent)" : "var(--surface)",
                  borderColor: skipReflection ? "var(--brand)" : "var(--border-input)",
                  boxShadow: skipReflection ? "var(--shadow-brand)" : "none",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: skipReflection ? "var(--brand)" : "var(--surface-sunken)",
                      color: skipReflection ? "var(--text-inverse)" : "var(--text-muted)",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                  <p
                    className="font-semibold text-[15px]"
                    style={{ color: "var(--text-heading)" }}
                  >
                    I&apos;m good, submit as-is
                  </p>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-body)" }}>
                  Just the data. You can always email us if more comes to mind.
                </p>
              </button>
            </div>
          </SectionCard>

          {/* -------- IX. Lasallian Reflection -------- */}
          <SectionCard id="lasallian">
            <Textarea
              label="Spirit of Faith"
              path="lasallianReflection.spiritOfFaith"
              value={form.lasallianReflection.spiritOfFaith}
              onChange={set}
              rows={3}
              hint="How did this activity help participants recognize their responsibility toward creation?"
            />
            <Textarea
              label="Zeal for Service"
              path="lasallianReflection.zealForService"
              value={form.lasallianReflection.zealForService}
              onChange={set}
              rows={3}
              hint="How did participants demonstrate active service through this initiative?"
            />
            <Textarea
              label="Communion in Mission"
              path="lasallianReflection.communionInMission"
              value={form.lasallianReflection.communionInMission}
              onChange={set}
              rows={3}
              hint="How did this activity contribute to collaboration within the Lasallian community?"
            />
          </SectionCard>

          {/* -------- X. Lessons Learned and Recommendations -------- */}
          <SectionCard id="lessons">
            <Textarea label="A. What Went Well" path="lessons.whatWentWell" value={form.lessons.whatWentWell} onChange={set} rows={3} />
            <Textarea label="B. Challenges Encountered" path="lessons.challenges" value={form.lessons.challenges} onChange={set} rows={3} />
            <Textarea label="C. Recommendations for Future Implementation" path="lessons.recommendations" value={form.lessons.recommendations} onChange={set} rows={3} />
            <Textarea label="D. Suggestions for the District Committee" path="lessons.districtSuggestions" value={form.lessons.districtSuggestions} onChange={set} rows={3} />

            <RadioGroup
              label="E. Will your institution be continuing this or a similar activity next campaign month?"
              options={CONTINUING_OPTIONS}
              path="lessons.continuing"
              value={form.lessons.continuing}
              onChange={set}
            />
            {form.lessons.continuing === "Yes" && (
              <Field label="Planned Activity" path="lessons.plannedActivity" value={form.lessons.plannedActivity} onChange={set} />
            )}
            {form.lessons.continuing === "No" && (
              <Field label="Reason" path="lessons.notContinuingReason" value={form.lessons.notContinuingReason} onChange={set} />
            )}
          </SectionCard>

          {/* -------- Consent block (only on last step, above sticky nav) -------- */}
          {isLastStep && (
            <div className="mt-6 space-y-4">
              <div
                className="rounded-2xl px-6 py-5 text-[14px] leading-relaxed"
                style={{ backgroundColor: "var(--surface-accent)", color: "var(--text-body)" }}
              >
                <p className="font-semibold mb-1.5" style={{ color: "var(--brand)" }}>One last thing</p>
                <p>
                  Your report goes to the <strong>#LEADforEarth</strong> committee at the Lasallian East Asia District. We use it to track progress, roll up district-wide results, and shape future campaigns. Nothing else.
                </p>
              </div>

              <label
                htmlFor="consent-check"
                className="flex items-start gap-3 cursor-pointer select-none rounded-2xl p-4 transition-colors"
                style={{ backgroundColor: consented ? "var(--overlay-brand-hover)" : "transparent" }}
              >
                <input
                  id="consent-check"
                  type="checkbox"
                  checked={consented}
                  onChange={(e) => setConsented(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-green-700 shrink-0"
                />
                <span className="text-[14px] leading-relaxed" style={{ color: "var(--text-body)" }}>
                  Everything above is accurate to the best of my knowledge, and my institution is OK with the committee reaching out if they have follow-up questions.
                </span>
              </label>
            </div>
          )}
        </form>

        {/* Desktop wizard nav: inline below the section card, matches the
            form's max-w-3xl. Hidden on mobile in favour of the sticky bar. */}
        <div className="hidden md:block mt-8">
          <WizardNav
            currentStep={currentStep}
            isLastStep={isLastStep}
            isSignedIn={isSignedIn}
            status={status}
            consented={consented}
            currentMetaTitle={currentMeta.title}
            onPrev={() => goTo(currentStep - 1)}
            onNext={() => handleNext()}
          />
        </div>
      </div>

      {/* Mobile sticky wizard nav (hidden on desktop). */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: "var(--nav-bg-blur)",
          backdropFilter: "saturate(150%) blur(16px)",
          WebkitBackdropFilter: "saturate(150%) blur(16px)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <WizardNav
            currentStep={currentStep}
            isLastStep={isLastStep}
            isSignedIn={isSignedIn}
            status={status}
            consented={consented}
            currentMetaTitle={currentMeta.title}
            onPrev={() => goTo(currentStep - 1)}
            onNext={() => handleNext()}
          />
        </div>
      </div>
    </section>
    </StepContext.Provider>
  );
}

// Prev / (Next | Submit | Sign in) button trio. Same markup in both the
// desktop inline nav and the mobile sticky bar.
function WizardNav({
  currentStep,
  isLastStep,
  isSignedIn,
  status,
  consented,
  currentMetaTitle,
  onPrev,
  onNext,
}: {
  currentStep: number;
  isLastStep: boolean;
  isSignedIn: boolean;
  status: Status;
  consented: boolean;
  currentMetaTitle: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 0}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-medium text-[13.5px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ color: "var(--text-body)" }}
        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "var(--overlay-hover)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>

      <p className="hidden sm:block text-[12px] truncate max-w-[40%]" style={{ color: "var(--text-muted)" }}>
        {currentMetaTitle}
      </p>

      {!isLastStep ? (
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full font-semibold text-[13.5px] transition-all duration-200 hover:-translate-y-px"
          style={{
            color: "var(--text-inverse)",
            backgroundColor: "var(--brand)",
            boxShadow: "var(--shadow-brand)",
          }}
        >
          Next
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      ) : isSignedIn ? (
        <button
          type="submit"
          form="lfe-report-form"
          disabled={status === "loading" || !consented}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-[13.5px] transition-all duration-200 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{
            color: "var(--text-inverse)",
            backgroundColor: "var(--brand)",
            boxShadow: consented ? "var(--shadow-brand)" : "none",
          }}
          title={!consented ? "Please confirm the consent above to submit." : undefined}
        >
          {status === "loading" ? (
            <>
              <svg viewBox="0 0 24 24" className="w-4 h-4 animate-spin" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
              </svg>
              Submitting…
            </>
          ) : (
            <>
              Submit Report
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>
      ) : (
        <button
          type="submit"
          form="lfe-signin-form"
          disabled={!consented}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-[13.5px] transition-all duration-200 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          style={{
            color: "var(--text-inverse)",
            backgroundColor: "var(--brand)",
            boxShadow: consented ? "var(--shadow-brand)" : "none",
          }}
          title={!consented ? "Please confirm the consent above first." : "Google verifies you're a real person before we accept the report."}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
            <path fill="#fff" d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.63 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95S8.78 6.5 12 6.5c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.7 3.9 14.55 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.2 0 8.63-3.65 8.63-8.78 0-.6-.07-1.05-.15-1.52z" />
          </svg>
          Sign in to submit
        </button>
      )}
    </div>
  );
}

function NextStep({ n, label, text }: { n: string; label: string; text: string }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: "var(--off-white)" }}>
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold mb-2"
        style={{ backgroundColor: "var(--brand)", color: "var(--text-inverse)" }}
      >
        {n}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--brand-mid)" }}>
        {label}
      </p>
      <p className="text-[13px] leading-snug" style={{ color: "var(--text-body)" }}>{text}</p>
    </div>
  );
}
