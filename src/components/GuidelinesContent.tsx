import Link from "next/link";
import ActionIdeas from "@/components/ActionIdeas";
import Contact from "@/components/Contact";
import GuidelinesTOC from "@/components/GuidelinesTOC";

const SECTIONS = [
  { id: "introduction", num: "I", title: "Introduction" },
  { id: "objectives", num: "II", title: "Objectives" },
  { id: "core-protocol", num: "III", title: "Core Protocol" },
  { id: "compliance", num: "IV", title: "Compliance & Ethics" },
  { id: "record-keeping", num: "V", title: "Record Keeping" },
  { id: "contact", num: "VI", title: "Contact" },
] as const;

const OBJECTIVES = [
  {
    title: "Create a shared platform",
    body:
      "Every environmental post from every campus carries one hashtag: #LEADForEarth. That's how we find each other's work.",
  },
  {
    title: "Document every action",
    body:
      "Every activity gets a standardized report through the portal. This turns scattered efforts into a shared record.",
  },
  {
    title: "Aggregate collective impact",
    body:
      "Every year, we publish a district-wide impact summary. Real numbers, real proof that collective action works.",
  },
];

const REQUIREMENTS = [
  {
    title: "Get in touch",
    body: (
      <>
        Email us at{" "}
        <a
          href="mailto:LeadForEarth@gmail.com"
          className="font-medium underline decoration-green-200 underline-offset-4 hover:decoration-green-500 transition"
          style={{ color: "#1a5c2a" }}
        >
          LeadForEarth@gmail.com
        </a>{" "}
        with your institution&apos;s contact info and location. We&apos;ll take
        it from there.
      </>
    ),
  },
  {
    title: "Pick your action",
    body: (
      <>
        Choose an environmental action that fits your campus. It can be
        something you&apos;re already doing, or something new. What matters is
        that it&apos;s meaningful and feasible for your community.
      </>
    ),
  },
  {
    title: "Document and report",
    body: (
      <>
        Post about your action on social media with{" "}
        <strong style={{ color: "#1a5c2a" }}>#LEADForEarth</strong>, then submit
        the details through the{" "}
        <Link
          href="/report"
          className="font-medium underline decoration-green-200 underline-offset-4 hover:decoration-green-500 transition"
          style={{ color: "#1a5c2a" }}
        >
          Report Portal
        </Link>{" "}
        so it counts toward the district&apos;s tally.
      </>
    ),
  },
];

const WORKFLOW = [
  {
    phase: "Planning",
    party: "Institutional Community",
    action: "Reach out to us and let us know you're in.",
  },
  {
    phase: "Implementation",
    party: "Institutional Community",
    action:
      "Run your chosen action, whether it's a Circular Economy Drive, tree planting, or something entirely your own.",
  },
  {
    phase: "Documentation",
    party: "Media / Social Media Team",
    action: "Post about it on your school's official channels, tagged with #LEADForEarth.",
  },
  {
    phase: "Final Reporting",
    party: "Task Force Lead",
    action:
      "Submit a report covering who joined, what happened, and what you learned along the way.",
  },
];

const ROLES = [
  {
    title: "Task Force Lead",
    body: "Your campus's single point of contact. Coordinates the action internally, keeps in touch with the LEADForEarth Committee, and files the final report (Phase IV). Often a faculty moderator, student council officer, or environmental club head, but it's up to your school.",
  },
  {
    title: "Institutional Community",
    body: "The people who actually plan and run the action (Phases I–II). Not a fixed group, just whoever takes it on: a club, a class, a department, or the whole student body.",
  },
  {
    title: "Media / Social Media Team",
    body: "The people who capture the moment. Photos, video, captions, and posts to your official channels using #LEADForEarth (Phase III). Could be your comms office or a student media team you delegate.",
  },
];

const COMPLIANCE = [
  {
    title: "Report real numbers",
    body: "Environmental metrics, especially CO₂ estimates, need to come from actual measurements or credible sources. The district's annual impact report is only as trustworthy as the data behind it.",
  },
  {
    title: "Keep the hashtag clean",
    body: "The #LEADForEarth hashtag is reserved for the work. Use it on posts that genuinely promote sustainability, climate advocacy, or campaign activity, and nothing else.",
  },
  {
    title: "Respect privacy",
    body: "Anyone visible in your photos or videos must have given proper institutional consent to be shown publicly. Same for the students, faculty, and staff you interview.",
  },
  {
    title: "Stay rooted in the values",
    body: "Ground your action in the Lasallian Core Values, especially the Spirit of Faith and the Preferential Option for the Poor. Climate change hits vulnerable communities the hardest, and that should shape what you do.",
  },
];

const RECORD_KEEPING = [
  {
    title: "The public archive",
    body: "The #LEADForEarth feed is the public record. Every post adds to a visible, shared history of the movement.",
  },
  {
    title: "Handover protocols",
    body: "Students graduate, faculty rotate. Build onboarding and documentation so the next cohort inherits what worked, not a blank slate.",
  },
  {
    title: "Central repository",
    body: "Keep final reports and educational materials in a central school folder or digital repo. Future teams (and evaluators) will need them.",
  },
];

export default function GuidelinesContent() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#fafbfa" }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-24 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.24em] mb-6"
            style={{ color: "#2d8c3e" }}
          >
            Official Document · Version 1.0
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            style={{ color: "#0d3d1a" }}
          >
            <span className="block">LEADForEarth</span>
            <span className="block" style={{ color: "#2d8c3e" }}>Guidelines.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto font-light mb-10">
            Everything your institution needs to know to join the district&apos;s
            shared environmental movement. Workflow, roles, standards, and
            record-keeping in one place.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#introduction"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: "#1a5c2a",
                boxShadow: "0 8px 20px -6px rgba(26,92,42,0.45)",
              }}
            >
              Start reading
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </a>
            <a
              href="/LEADForEarth-Guidelines.pdf"
              download="LEADForEarth-Guidelines.pdf"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 bg-white/60 hover:bg-green-50"
              style={{
                color: "#1a5c2a",
                boxShadow: "inset 0 0 0 1.5px rgba(26,92,42,0.25)",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section
        className="pb-24 sm:pb-32"
        style={{ backgroundColor: "#fafbfa" }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-20 items-start">
            {/* Sticky Sidebar TOC */}
            <aside className="hidden lg:block lg:sticky lg:top-28">
              <GuidelinesTOC sections={SECTIONS} />
            </aside>

            {/* Main Content */}
            <div className="space-y-24 sm:space-y-32 pt-4">
              {/* I. Introduction */}
              <SectionBlock id="introduction" num="I" title="Introduction">
                <p className="text-xl sm:text-2xl font-light text-gray-800 leading-relaxed tracking-tight">
                  <strong className="font-semibold" style={{ color: "#0d3d1a" }}>
                    LEADForEarth
                  </strong>{" "}
                  is a district-wide digital initiative from the Lasallian East
                  Asia District. Guided by our Core Values, it unites and
                  documents the environmental work of every campus in one
                  shared space.
                </p>
                <p>
                  The goal is simple: keep the momentum going, and stop local
                  efforts from getting lost in the shuffle. Every action from
                  every school lives under one continuous, visible movement.
                </p>
              </SectionBlock>

              {/* II. Objectives */}
              <SectionBlock id="objectives" num="II" title="Objectives">
                <p>Three goals shape everything we do:</p>
                <div className="space-y-3 not-prose pt-2">
                  {OBJECTIVES.map((o, i) => (
                    <NumberedCard key={o.title} n={i + 1} title={o.title}>
                      {o.body}
                    </NumberedCard>
                  ))}
                </div>
                <p className="pt-4">
                  Together, they let us unite against climate change, prove that
                  collective work has real impact, and inspire more schools in
                  the Lasallian Network to document what they&apos;re already
                  doing.
                </p>
              </SectionBlock>

              {/* III. Core Protocol */}
              <SectionBlock id="core-protocol" num="III" title="Core Protocol">
                <p>
                  What every participating institution needs to do. Three
                  requirements to get started, one workflow to follow, and three
                  roles to fill.
                </p>

                <SubHeading num="3.1" title="Requirements" />
                <p>Three things to have in place before joining:</p>
                <div className="space-y-3 not-prose pt-2">
                  {REQUIREMENTS.map((r, i) => (
                    <NumberedCard key={r.title} n={i + 1} title={r.title}>
                      {r.body}
                    </NumberedCard>
                  ))}
                </div>

                <div className="pt-4">
                  <ActionIdeas />
                </div>

                <SubHeading num="3.2" title="Reporting Process" />
                <p>The same four-phase workflow keeps every campus in sync.</p>

                {/* Workflow timeline */}
                <div className="not-prose pt-4">
                  <ol className="relative">
                    {/* Vertical connector line */}
                    <div
                      className="absolute left-6 top-4 bottom-4 w-px"
                      style={{ backgroundColor: "#c8e6c9" }}
                      aria-hidden="true"
                    />
                    {WORKFLOW.map((w, i) => (
                      <li
                        key={w.phase}
                        className="relative pl-16 pb-8 last:pb-0"
                      >
                        <span
                          className="absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold z-10"
                          style={{
                            backgroundColor: "#1a5c2a",
                            color: "#ffffff",
                            boxShadow: "0 0 0 4px #fafbfa",
                          }}
                          aria-hidden="true"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h4
                          className="font-semibold text-lg tracking-tight mb-1"
                          style={{ color: "#0d3d1a" }}
                        >
                          {w.phase}
                        </h4>
                        <p
                          className="text-xs uppercase tracking-widest font-semibold mb-2"
                          style={{ color: "#2d8c3e" }}
                        >
                          {w.party}
                        </p>
                        <p className="text-gray-600 leading-relaxed text-[15px]">
                          {w.action}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                <SubHeading num="3.3" title="Roles & Responsibilities" />
                <p>
                  Each campus needs to know who&apos;s doing what. Three roles
                  cover the workflow:
                </p>
                <div className="space-y-3 not-prose pt-2">
                  {ROLES.map((r, i) => (
                    <NumberedCard key={r.title} n={i + 1} title={r.title}>
                      {r.body}
                    </NumberedCard>
                  ))}
                </div>
                <p
                  className="text-sm italic text-gray-500 pt-4 pl-4 border-l-2"
                  style={{ borderColor: "#c8e6c9" }}
                >
                  One person can wear more than one hat if your team is small.
                  What matters is that each phase has someone owning it.
                </p>
              </SectionBlock>

              {/* IV. Compliance */}
              <SectionBlock
                id="compliance"
                num="IV"
                title="Compliance & Ethics"
              >
                <p>
                  Four ground rules keep the initiative credible and safe for
                  everyone involved.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose pt-4">
                  {COMPLIANCE.map((c) => (
                    <SoftCard key={c.title} title={c.title}>
                      {c.body}
                    </SoftCard>
                  ))}
                </div>
              </SectionBlock>

              {/* V. Record Keeping */}
              <SectionBlock
                id="record-keeping"
                num="V"
                title="Record Keeping"
              >
                <p>
                  Good record-keeping is how this becomes a lasting habit, not
                  a one-off event.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 not-prose pt-4">
                  {RECORD_KEEPING.map((r) => (
                    <SoftCard key={r.title} title={r.title}>
                      {r.body}
                    </SoftCard>
                  ))}
                </div>
              </SectionBlock>
            </div>
          </div>
        </div>
      </section>

      {/* VI. Contact: full-width, uses the site's shared Contact form */}
      <Contact />

      {/* Full-bleed CTA */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#1a5c2a" }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
            Ready to file your report?
          </h3>
          <p className="text-green-100 text-lg font-light max-w-lg mx-auto mb-10 leading-relaxed">
            Once your campus has carried out its environmental action, submit
            the standardized report through the official portal.
          </p>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[15px] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ color: "#0d3d1a" }}
          >
            Submit Your Report
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
          </Link>
        </div>
      </section>

      {/* Document Control: quiet footer meta for the whole document */}
      <section style={{ backgroundColor: "#fafbfa" }} className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-xs">
            <MetaField label="Version" value="1.0" />
            <MetaField label="Effective" value="August 2026" />
            <MetaField label="Revised" value="August 2026" />
            <MetaField label="Approved by" value="Renz Aron Q. Gorre" />
          </dl>
        </div>
      </section>
    </div>
  );
}

function SectionBlock({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-10">
        <p
          className="text-xs font-semibold tracking-[0.24em] uppercase mb-3"
          style={{ color: "#2d8c3e" }}
        >
          Section {num}
        </p>
        <h2
          className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]"
          style={{ color: "#0d3d1a" }}
        >
          {title}
        </h2>
      </div>
      <div className="space-y-6 text-[17px] text-gray-600 leading-[1.7] max-w-2xl">
        {children}
      </div>
    </section>
  );
}

function SubHeading({ num, title }: { num: string; title: string }) {
  return (
    <div className="pt-6 flex items-baseline gap-3">
      <span
        className="text-sm font-mono font-semibold"
        style={{ color: "#2d8c3e" }}
      >
        {num}
      </span>
      <h3
        className="text-2xl font-semibold tracking-tight"
        style={{ color: "#0d3d1a" }}
      >
        {title}
      </h3>
    </div>
  );
}

function NumberedCard({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl bg-white p-6 flex gap-5 transition-transform hover:-translate-y-0.5"
      style={{
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 6px 20px -8px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
        style={{ backgroundColor: "#f0faf1", color: "#1a5c2a" }}
        aria-hidden="true"
      >
        {n}
      </div>
      <div className="min-w-0">
        <h4
          className="font-semibold text-base sm:text-lg tracking-tight mb-1.5"
          style={{ color: "#0d3d1a" }}
        >
          {title}
        </h4>
        <p className="text-[15px] text-gray-600 leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}

function SoftCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl bg-white p-6 transition-transform hover:-translate-y-0.5"
      style={{
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 6px 20px -8px rgba(0,0,0,0.06)",
      }}
    >
      <h4
        className="font-semibold text-base sm:text-lg tracking-tight mb-2"
        style={{ color: "#0d3d1a" }}
      >
        {title}
      </h4>
      <p className="text-[15px] text-gray-600 leading-relaxed">{children}</p>
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1.5">
        {label}
      </dt>
      <dd className="text-sm font-medium text-gray-700">{value}</dd>
    </div>
  );
}
