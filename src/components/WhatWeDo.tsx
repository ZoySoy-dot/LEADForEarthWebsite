const steps = [
  {
    title: "Create Action",
    description:
      "Each participating school selects an environmental action that's meaningful and feasible for its own community.",
  },
  {
    title: "Post with #LEADforEarth",
    description:
      "Document your action on your school's official social media platforms using #LEADforEarth, and share your story with the district committee.",
  },
  {
    title: "Report",
    description:
      "Submit a standardized report to the LEADForEarth committee through this website.",
  },
  {
    title: "Share Your Story",
    description:
      "The district committee compiles the stories and shares them on the official LEADForEarth platforms, highlighting the collective impact of all participating schools.",
  },
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-28 sm:py-36" style={{ backgroundColor: "var(--surface)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Split: sticky heading (left) + timeline (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">
          {/* Left: sticky headline */}
          <div className="lg:sticky lg:top-32">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-5" style={{ color: "var(--brand-mid)" }}>
              How It Works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]" style={{ color: "var(--text-heading)" }}>
              <span className="block">Four steps.</span>
              <span className="block">Endless impact.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed font-light max-w-sm" style={{ color: "var(--text-muted)" }}>
              Every school, every campus. A shared rhythm that turns individual actions into a district-wide movement.
            </p>
          </div>

          {/* Right: timeline */}
          <div>
            <ol className="relative">
              <div
                className="absolute left-6 top-6 bottom-6 w-px"
                style={{ backgroundColor: "var(--brand-glow)" }}
                aria-hidden="true"
              />
              {steps.map((s, i) => (
                <li key={s.title} className="relative pl-20 pb-12 last:pb-0">
                  <span
                    className="absolute left-0 top-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold z-10"
                    style={{
                      backgroundColor: "var(--brand)",
                      color: "var(--text-inverse)",
                      // Outer white ring uses the section surface so the marker
                      // reads punched-through in both themes.
                      boxShadow: "0 0 0 6px var(--surface), var(--shadow-brand)",
                    }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-semibold text-xl sm:text-2xl tracking-tight mb-2" style={{ color: "var(--text-heading)" }}>
                    {s.title}
                  </h3>
                  <p className="text-[16px] leading-[1.7]" style={{ color: "var(--text-body)" }}>
                    {s.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

      </div>
    </section>
  );
}
