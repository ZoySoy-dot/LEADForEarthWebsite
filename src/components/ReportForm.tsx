"use client";

import { createContext, useContext, useReducer, useState } from "react";
import SchoolAutocomplete from "@/components/SchoolAutocomplete";
import { SDG_GOALS } from "@/data/sdgs";

// ============================================================================
// EDITABLE CONTENT — edit question wording, add/remove options here
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

const OBJECTIVES = [
  "To promote actions that reduce waste and energy consumption through presenting tangible evidence and statistics that highlight their economic impacts.",
  "To encourage participants to take action towards addressing environmental issues such as pollution, high carbon emissions, and deforestation by emphasizing their effects on ecosystems and human health.",
  "To instill in participants consistent habits, efforts, and practices that support a healthier environment, integrating simple actions (e.g., powering down lights and devices) into the program's activities.",
  "To elevate Climate Literacy and Reflection: integrate dedicated educational discussions and reflection periods during each institution's chosen action day, providing students and educators with the opportunity to deepen their understanding of global environmental challenges and sustainable practices.",
  "Establish a Framework for Continuous Action: use the success and data gathered from the inaugural August campaign month as a foundational blueprint for future, recurring sustainability initiatives across the district.",
  "Foster Cross-Sector Lasallian Collaboration: dismantle the isolated nature of current student-led environmental efforts by establishing a robust, collaborative network among the participating institutions within the Lasallian East Asia District, embodying the core value of Communion in Mission.",
];

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
  { id: "submitter", num: "0", title: "Submitter", subtitle: "Who is filing this report on behalf of the institution?" },
  { id: "overview", num: "I", title: "Project Overview" },
  { id: "participation", num: "II", title: "Participation Data" },
  { id: "objectives", num: "III", title: "Objectives Assessment", subtitle: "Rate whether each district-level objective was achieved through this activity." },
  { id: "impact", num: "IV", title: "Environmental Impact Evaluation", subtitle: "Sub-sections appear based on your selections in Section I. Fill only indicators relevant to your activity." },
  { id: "effectiveness", num: "V", title: "Effectiveness of Implementation", subtitle: "Rate each criterion from 1 (Poor) to 5 (Excellent)." },
  { id: "climate", num: "VI", title: "Climate Literacy and Reflection" },
  { id: "feedback", num: "VII", title: "Participant Feedback" },
  { id: "digital", num: "VIII", title: "Digital Advocacy Impact" },
  { id: "lasallian", num: "IX", title: "Lasallian Reflection" },
  { id: "lessons", num: "X", title: "Lessons Learned & Recommendations", subtitle: "Honest reflections are more valuable than polished ones." },
  { id: "documentation", num: "XI", title: "Documentation", subtitle: "Optional. Paste links to photos, event pages, or supporting docs." },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];
const SECTIONS_MAP = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));

// Words of encouragement — index matches SECTIONS order. Kept short so the
// floating progress pill stays compact on small screens.
const ENCOURAGEMENTS = [
  "Thanks for showing up. Let's begin.",
  "Every detail makes the impact real.",
  "Nice pace. Every data point counts.",
  "You're doing meaningful work.",
  "The heart of the report. Keep going.",
  "Halfway signal! You're crushing it!",
  "Your reflections matter here.",
  "The voices you're capturing count.",
  "Amplify the ripple. Almost there.",
  "Beautiful reflections. Nearly done.",
  "Honest lessons help everyone.",
  "Final section. You made it!",
] as const;

// ============================================================================
// STATE SHAPE — mirrors the email payload one-to-one
// ============================================================================

type Achieved = "" | "Yes" | "Partially" | "No";
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
    community: string;
    total: string;
    schoolPopulation: string;
    rate: string;
  };
  objectives: { text: string; achieved: Achieved; evidence: string }[];
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
  participation: { students: "", faculty: "", staffAdmin: "", community: "", total: "", schoolPopulation: "", rate: "" },
  objectives: OBJECTIVES.map((text) => ({ text, achieved: "", evidence: "" })),
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

// Path-based state reducer — `set("overview.schoolName", "Foo")` walks the object.
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
// PRIMITIVE INPUTS — shared styling lives here. Change once, updates everywhere.
// ============================================================================

const INPUT_CLS =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition";
const LABEL_CLS = "block text-sm font-medium text-gray-700 mb-1.5";

type SetFn = (path: string, value: unknown) => void;

function Field({
  label, path, value, onChange, type = "text", placeholder, required, hint,
}: {
  label: string; path: string; value: string; onChange: SetFn;
  type?: string; placeholder?: string; required?: boolean; hint?: string;
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
        onChange={(e) => onChange(path, e.target.value)}
        placeholder={placeholder}
        required={required}
        className={INPUT_CLS}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
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
      <label className={LABEL_CLS}>
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
      />
      <div className="flex items-start justify-between mt-1 gap-3">
        <p className="text-xs text-gray-500">{hint}</p>
        {maxWords && (
          <p className={`text-xs shrink-0 ${over ? "text-red-600 font-semibold" : "text-gray-400"}`}>
            {count} / {maxWords} words
          </p>
        )}
      </div>
    </div>
  );
}

// Tailwind's static scan can't parse dynamic class strings — hardcode the grid classes.
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
      <label className={LABEL_CLS}>{label}</label>
      <div className={`grid ${CHECKBOX_COLS[cols]} gap-2`}>
        {options.map((opt) => (
          <label key={opt.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
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

// Colored-tile picker for the 17 SDGs. Each tile is a full-width button; the
// left square shows the goal number in the UN's official color, and selection
// state is signaled by that color washing across the tile border + background.
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
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-500 shrink-0">
          {selectedCount} selected
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {SDG_GOALS.map((g) => {
          const checked = !!values[g.key];
          return (
            <button
              key={g.key}
              type="button"
              onClick={() => onChange(`${basePath}.${g.key}`, !checked)}
              aria-pressed={checked}
              className={`group relative flex items-stretch text-left rounded-xl overflow-hidden border transition-all ${
                checked
                  ? "border-transparent shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
              style={
                checked
                  ? { backgroundColor: `${g.color}14`, boxShadow: `inset 0 0 0 2px ${g.color}` }
                  : undefined
              }
            >
              <span
                className="shrink-0 w-11 flex flex-col items-center justify-center text-white font-bold"
                style={{ backgroundColor: g.color }}
              >
                <span className="text-[9px] leading-none uppercase tracking-wide opacity-80">SDG</span>
                <span className="text-base leading-none mt-0.5">{g.num}</span>
              </span>
              <span className="flex-1 px-3 py-2 pr-8 text-xs sm:text-[13px] font-medium text-gray-800 leading-snug flex items-center">
                {g.title}
              </span>
              <span
                className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold transition-opacity ${
                  checked ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundColor: g.color }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.5L5 9l4.5-5" />
                </svg>
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
      <label className={LABEL_CLS}>{label}</label>
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
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

function ProgressRing({ percent }: { percent: number }) {
  const size = 64;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e8f5e9" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a5c2a"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 400ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color: "#1a5c2a" }}>{percent}%</span>
      </div>
    </div>
  );
}

// Wizard context — SectionCard reads currentStep from here to decide if it renders.
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
      className={`bg-white rounded-2xl shadow-sm p-6 sm:p-8 ${
        direction === 1 ? "lfe-slide-right" : "lfe-slide-left"
      }`}
    >
      <div className="flex items-start gap-4 mb-6 pb-4 border-b border-gray-100">
        <div
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: "#e8f5e9", color: "#1a5c2a" }}
        >
          {meta.num}
        </div>
        <div className="pt-1">
          <h3 className="text-xl font-bold" style={{ color: "#1a5c2a" }}>
            {meta.title}
          </h3>
          {"subtitle" in meta && meta.subtitle && (
            <p className="text-sm text-gray-500 mt-1">{meta.subtitle}</p>
          )}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

// Wraps a conditional Impact Evaluation sub-block in a bordered green panel
// so multiple selected initiative types don't visually blur together.
function ImpactPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-green-100 rounded-xl p-5 bg-green-50/40">
      <h4 className="font-semibold mb-4" style={{ color: "#2d8c3e" }}>{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

const ACHIEVED_OPTIONS = [
  { key: "Yes", label: "Yes" },
  { key: "Partially", label: "Partially" },
  { key: "No", label: "No" },
];

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

export default function ReportForm() {
  const [form, dispatch] = useReducer(reducer, INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const set: SetFn = (path, value) => dispatch({ type: "SET", path, value });
  const totalSteps = SECTIONS.length;
  const isLastStep = currentStep === totalSteps - 1;

  function goTo(n: number) {
    if (n < 0 || n >= totalSteps) return;
    setDirection(n > currentStep ? 1 : -1);
    setCurrentStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNext(e: React.MouseEvent<HTMLButtonElement>) {
    // Only fields on the visible step are in the DOM, so native form validation
    // naturally scopes to the current step.
    const nativeForm = e.currentTarget.form;
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <section style={{ backgroundColor: "#f7faf7" }} className="py-24 min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "#1a5c2a" }}>
              Impact Report Submitted!
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Thank you for sharing your institution&apos;s #LEADforEarth impact. The district
              committee will be in touch.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="px-6 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: "#1a5c2a" }}
            >
              Submit another report
            </button>
          </div>
        </div>
      </section>
    );
  }

  const currentMeta = SECTIONS[currentStep];
  const percentComplete = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <StepContext.Provider value={{ currentStep, direction, goTo }}>
    <section style={{ backgroundColor: "#f7faf7" }} className="py-12 sm:py-16 pb-32 sm:pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#2d8c3e" }}>
            #LEADforEarth Impact Template
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ color: "#1a5c2a" }}>
            Submit Your Impact Report
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
            Share your institution&apos;s environmental initiative: activities, data,
            reflections, and lessons. Complete only the impact indicators relevant to
            your activity.
          </p>
        </div>

        {/* Step indicator — numbered dots, click to jump to any step */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 justify-start sm:justify-center scrollbar-thin">
          {SECTIONS.map((s, i) => {
            const state =
              currentStep === i ? "current" : currentStep > i ? "done" : "todo";
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                title={s.title}
                aria-label={`Go to step ${i + 1}: ${s.title}`}
                aria-current={state === "current" ? "step" : undefined}
                className={`shrink-0 w-10 h-10 rounded-full text-xs font-bold transition-colors ${
                  state === "current"
                    ? "text-white ring-2 ring-offset-2"
                    : state === "done"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
                style={
                  state === "current"
                    ? { backgroundColor: "#1a5c2a", ["--tw-ring-color" as string]: "#c8e6c9" }
                    : undefined
                }
              >
                {s.num}
              </button>
            );
          })}
        </div>

        {status === "error" && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* -------- Submitter -------- */}
          <SectionCard id="submitter">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" path="submitter.name" value={form.submitter.name} onChange={set} required placeholder="Juan Dela Cruz" />
              <Field label="Role / Position" path="submitter.role" value={form.submitter.role} onChange={set} required placeholder="Sustainability Officer" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email Address" path="submitter.email" type="email" value={form.submitter.email} onChange={set} required placeholder="you@school.edu.ph" />
              <Field label="Phone (optional)" path="submitter.phone" value={form.submitter.phone} onChange={set} placeholder="+63 917 000 0000" />
            </div>
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
              hint="Autocomplete from Lasallian East Asia District schools. Type freely if yours isn't listed."
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
              <Field label="Number of Students" path="participation.students" type="number" value={form.participation.students} onChange={set} />
              <Field label="Number of Faculty" path="participation.faculty" type="number" value={form.participation.faculty} onChange={set} />
              <Field label="Staff, Associates, and Administration" path="participation.staffAdmin" type="number" value={form.participation.staffAdmin} onChange={set} />
              <Field label="Community Members" path="participation.community" type="number" value={form.participation.community} onChange={set} />
              <Field label="Total Number of Participants" path="participation.total" type="number" value={form.participation.total} onChange={set} />
              <Field label="Total School Population" path="participation.schoolPopulation" type="number" value={form.participation.schoolPopulation} onChange={set} />
            </div>
            <Field label="Participation Rate (%)" path="participation.rate" type="number" value={form.participation.rate} onChange={set} placeholder="e.g., 42" />
          </SectionCard>

          {/* -------- III. Objectives Assessment -------- */}
          <SectionCard id="objectives">
            {form.objectives.map((obj, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  <span className="font-semibold mr-1">{i + 1}.</span>
                  {obj.text}
                </p>
                <RadioGroup
                  label="Achieved?"
                  options={ACHIEVED_OPTIONS}
                  path={`objectives.${i}.achieved`}
                  value={obj.achieved}
                  onChange={set}
                />
                <div className="mt-3">
                  <Textarea
                    label="Evidence / Explanation"
                    path={`objectives.${i}.evidence`}
                    value={obj.evidence}
                    onChange={set}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </SectionCard>

          {/* -------- IV. Environmental Impact Evaluation -------- */}
          <SectionCard id="impact">
            {!Object.values(form.overview.initiativeTypes).some(Boolean) && (
              <div className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                Select at least one Type of Initiative in Section I to reveal impact indicators.
              </div>
            )}

            {form.overview.initiativeTypes.energy && (
              <ImpactPanel title="Energy Conservation">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Baseline: 1 month before (kWh)" path="impact.energy.baselineKwh" type="number" value={form.impact.energy.baselineKwh} onChange={set} />
                  <Field label="Post-activity: 1 month after (kWh)" path="impact.energy.postKwh" type="number" value={form.impact.energy.postKwh} onChange={set} />
                  <Field label="kWh Reduced" path="impact.energy.kwhReduced" type="number" value={form.impact.energy.kwhReduced} onChange={set} />
                  <Field label="Estimated Cost Savings" path="impact.energy.costSavings" value={form.impact.energy.costSavings} onChange={set} placeholder="₱" />
                  <Field label="Classrooms/Offices/Departments Participating" path="impact.energy.unitsParticipating" type="number" value={form.impact.energy.unitsParticipating} onChange={set} />
                </div>
              </ImpactPanel>
            )}

            {form.overview.initiativeTypes.water && (
              <ImpactPanel title="Water Conservation">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Baseline: 1 month before (liter / m³)" path="impact.water.baselineWater" value={form.impact.water.baselineWater} onChange={set} />
                  <Field label="Post-activity: 1 month after (liter / m³)" path="impact.water.postWater" value={form.impact.water.postWater} onChange={set} />
                  <Field label="Estimated Liters Saved" path="impact.water.litersSaved" type="number" value={form.impact.water.litersSaved} onChange={set} />
                  <Field label="Estimated Cost Savings" path="impact.water.costSavings" value={form.impact.water.costSavings} onChange={set} placeholder="₱" />
                  <Field label="Classrooms/Offices/Departments Participating" path="impact.water.unitsParticipating" type="number" value={form.impact.water.unitsParticipating} onChange={set} />
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
                  <Field label="Native Species Planted/Protected" path="impact.biodiversity.speciesPlanted" type="number" value={form.impact.biodiversity.speciesPlanted} onChange={set} />
                  <Field label="Area Rehabilitated (sqm / hectares)" path="impact.biodiversity.areaRehabilitated" value={form.impact.biodiversity.areaRehabilitated} onChange={set} />
                  <Field label="Awareness Activities Conducted" path="impact.biodiversity.awarenessActivities" type="number" value={form.impact.biodiversity.awarenessActivities} onChange={set} />
                  <Field label="Partner Organizations" path="impact.biodiversity.partnerOrgs" value={form.impact.biodiversity.partnerOrgs} onChange={set} />
                  <Field label="Classrooms/Offices/Departments Participating" path="impact.biodiversity.unitsParticipating" type="number" value={form.impact.biodiversity.unitsParticipating} onChange={set} />
                </div>
              </ImpactPanel>
            )}

            {form.overview.initiativeTypes.waste && (
              <ImpactPanel title="Waste Reduction / Recycling">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Baseline: 1 month before (kg)" path="impact.waste.baselineKg" type="number" value={form.impact.waste.baselineKg} onChange={set} />
                  <Field label="Post-activity: 1 month after (kg)" path="impact.waste.postKg" type="number" value={form.impact.waste.postKg} onChange={set} />
                  <Field label="Total Waste Collected (kg)" path="impact.waste.totalCollected" type="number" value={form.impact.waste.totalCollected} onChange={set} />
                  <Field label="Waste Recycled / Diverted (kg)" path="impact.waste.recycledDiverted" type="number" value={form.impact.waste.recycledDiverted} onChange={set} />
                  <Field label="Reduction in Waste Generation (%)" path="impact.waste.reductionPct" type="number" value={form.impact.waste.reductionPct} onChange={set} />
                  <Field label="Classrooms/Offices/Departments Participating" path="impact.waste.unitsParticipating" type="number" value={form.impact.waste.unitsParticipating} onChange={set} />
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
                  <Field label="Sessions Conducted" path="impact.education.sessions" type="number" value={form.impact.education.sessions} onChange={set} />
                  <Field label="Speakers / Resource Persons" path="impact.education.speakers" type="number" value={form.impact.education.speakers} onChange={set} />
                  <Field label="Educational Materials Distributed" path="impact.education.materials" type="number" value={form.impact.education.materials} onChange={set} />
                  <Field label="Attendees" path="impact.education.attendees" type="number" value={form.impact.education.attendees} onChange={set} />
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
                  <Field label="Total Waste Collected (kg)" path="impact.cleanup.wasteCollected" type="number" value={form.impact.cleanup.wasteCollected} onChange={set} />
                  <Field label="Area Cleaned (sqm / hectares)" path="impact.cleanup.areaCleaned" value={form.impact.cleanup.areaCleaned} onChange={set} />
                  <Field label="Trash Bags Filled" path="impact.cleanup.bagsFilled" type="number" value={form.impact.cleanup.bagsFilled} onChange={set} />
                  <Field label="Partner Organizations" path="impact.cleanup.partnerOrgs" value={form.impact.cleanup.partnerOrgs} onChange={set} />
                  <Field label="Volunteers Involved" path="impact.cleanup.volunteers" type="number" value={form.impact.cleanup.volunteers} onChange={set} />
                </div>
              </ImpactPanel>
            )}

            {form.overview.initiativeTypes.circular && (
              <ImpactPanel title="Circular Economy Drive">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Donated Items Collected" path="impact.circular.itemsCollected" type="number" value={form.impact.circular.itemsCollected} onChange={set} />
                  <Field label="Items Sold / Redistributed" path="impact.circular.itemsRedistributed" type="number" value={form.impact.circular.itemsRedistributed} onChange={set} />
                  <Field label="Funds Raised" path="impact.circular.fundsRaised" value={form.impact.circular.fundsRaised} onChange={set} placeholder="₱" />
                  <Field label="Beneficiary Organization(s)" path="impact.circular.beneficiaryOrgs" value={form.impact.circular.beneficiaryOrgs} onChange={set} />
                  <Field label="Partner Organizations" path="impact.circular.partnerOrgs" value={form.impact.circular.partnerOrgs} onChange={set} />
                  <Field label="Volunteers Involved" path="impact.circular.volunteers" type="number" value={form.impact.circular.volunteers} onChange={set} />
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
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_2fr] gap-3 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <p className="text-sm text-gray-700 pt-3">{c.criteria}</p>
                <select
                  value={c.rating}
                  onChange={(e) => set(`effectiveness.${i}.rating`, e.target.value)}
                  className={INPUT_CLS}
                >
                  <option value="">Rating</option>
                  <option value="1">1 (Poor)</option>
                  <option value="2">2</option>
                  <option value="3">3 (Satisfactory)</option>
                  <option value="4">4</option>
                  <option value="5">5 (Excellent)</option>
                </select>
                <input
                  type="text"
                  value={c.remarks}
                  onChange={(e) => set(`effectiveness.${i}.remarks`, e.target.value)}
                  placeholder="Remarks"
                  className={INPUT_CLS}
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
              <label className={LABEL_CLS}>Campaign Reach</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <input
                  type="number"
                  placeholder="Reactions / Likes"
                  className={INPUT_CLS}
                  value={form.digitalAdvocacy.reach.reactions}
                  onChange={(e) => set("digitalAdvocacy.reach.reactions", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Comments"
                  className={INPUT_CLS}
                  value={form.digitalAdvocacy.reach.comments}
                  onChange={(e) => set("digitalAdvocacy.reach.comments", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Shares / Reposts"
                  className={INPUT_CLS}
                  value={form.digitalAdvocacy.reach.shares}
                  onChange={(e) => set("digitalAdvocacy.reach.shares", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Reach / Views"
                  className={INPUT_CLS}
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

          {/* -------- Documentation -------- */}
          <SectionCard id="documentation">
            <Textarea
              label="Photo / Documentation Links"
              path="documentationLinks"
              value={form.documentationLinks}
              onChange={set}
              rows={4}
              placeholder="One URL per line"
            />
          </SectionCard>

          {/* -------- Wizard nav (Prev / Next / Submit) -------- */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goTo(currentStep - 1)}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-xl font-semibold text-sm border border-gray-200 bg-white text-gray-700 transition-opacity hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {!isLastStep ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#1a5c2a" }}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#1a5c2a" }}
              >
                {status === "loading" ? "Submitting…" : "Submit Impact Report"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* -------- Floating progress ring (bottom-right) -------- */}
      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 sm:px-5 sm:py-4 w-[min(92vw,290px)]"
        aria-live="polite"
      >
        <div className="flex items-center gap-4">
          <ProgressRing percent={percentComplete} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Step {currentStep + 1} of {totalSteps}
            </p>
            <p className="text-sm font-semibold leading-tight truncate" style={{ color: "#1a5c2a" }}>
              {currentMeta.title}
            </p>
            <p className="text-[11px] italic mt-1 leading-snug" style={{ color: "#2d8c3e" }}>
              {ENCOURAGEMENTS[currentStep]}
            </p>
          </div>
        </div>
      </div>
    </section>
    </StepContext.Provider>
  );
}
