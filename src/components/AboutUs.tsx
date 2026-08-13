function LeafIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 4 13c0-6 6-11 15-11 0 8-4 15-8 15z" />
      <path d="M4 13c2 0 6 1 8 8" />
    </svg>
  );
}

function SproutIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M4 8c0-3 2-5 5-5 0 5-2 8-5 8V8z" />
      <path d="M20 6c0-3-2-5-5-5 0 5 2 8 5 8V6z" />
      <path d="M6 22h12" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </svg>
  );
}

const values = [
  {
    icon: <LeafIcon />,
    title: "Spirit of Faith",
    description:
      "Every action we take is grounded in our relationship with the Creator who entrusted this Earth to our care.",
  },
  {
    icon: <SproutIcon />,
    title: "Zeal for Service",
    description:
      "We translate concern into concrete action, approaching our work with generosity and creativity.",
  },
  {
    icon: <GlobeIcon />,
    title: "Communion in Mission",
    description:
      "Different campuses, different actions, one shared mission across continents as one global body of young Lasallians.",
  },
];

export default function AboutUs() {
  return (
    <section id="about" className="py-28 sm:py-36" style={{ backgroundColor: "#fafbfa" }}>
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Centered header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-4" style={{ color: "#2d8c3e" }}>
            What is LEADForEarth?
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]" style={{ color: "#0d3d1a" }}>
            A movement rooted in faith and action.
          </h2>
        </div>

        {/* Body copy + pull quote */}
        <div className="max-w-2xl mx-auto mb-24 sm:mb-32">
          <p className="text-[17px] text-gray-600 leading-[1.75] mb-8">
            <strong className="font-semibold" style={{ color: "#0d3d1a" }}>LEADForEarth</strong> is the environmental initiative of the Lasallian East Asia District. Emerging from the first International LEAD EcoCamp, the program moves our institutions from simple awareness to concrete, repeatable action.
          </p>

          <blockquote className="my-10 py-6 pl-8 border-l-2" style={{ borderColor: "#2d8c3e" }}>
            <p className="text-2xl font-semibold italic leading-[1.35] tracking-tight" style={{ color: "#0d3d1a" }}>
              United not by strict uniformity, but by a shared and enduring mission to protect our planet.
            </p>
          </blockquote>

          <p className="text-[17px] text-gray-600 leading-[1.75]">
            Grounded in the Lasallian core value of <em>Communion in Mission</em>, LEADForEarth trusts each institution to contribute in the way most meaningful to its local context. Together, our diverse commitments live under a single banner:{" "}
            <strong style={{ color: "#1a5c2a" }}>#LEADforEarth</strong>.
          </p>
        </div>

        {/* Mission & Vision as two elegant cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24 sm:mb-28">
          <div
            className="rounded-3xl bg-white p-8 sm:p-10"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 10px 32px -10px rgba(26,92,42,0.1)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-4" style={{ color: "#2d8c3e" }}>
              Our Mission
            </p>
            <p className="text-2xl sm:text-[26px] font-semibold tracking-tight leading-[1.25]" style={{ color: "#0d3d1a" }}>
              To empower Lasallian students across East Asia to take coordinated environmental action, united under one banner:{" "}
              <span style={{ color: "#2d8c3e" }}>#LEADforEarth</span>.
            </p>
          </div>
          <div
            className="rounded-3xl bg-white p-8 sm:p-10"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 10px 32px -10px rgba(26,92,42,0.1)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-4" style={{ color: "#2d8c3e" }}>
              Our Vision
            </p>
            <p className="text-lg text-gray-600 leading-[1.65]">
              A district where students are empowered to act, and where the Lasallian community stands united in ecological stewardship. A future where environmental action is <em>seen</em>, celebrated, and never forgotten.
            </p>
          </div>
        </div>

        {/* Values; quieter sub-heading, no giant two-tone repeat */}
        <div>
          <div className="flex items-baseline justify-between mb-10 pb-4 border-b border-gray-200">
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: "#0d3d1a" }}>
              What guides us
            </h3>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: "#2d8c3e" }}>
              Core Values
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-3xl bg-white p-8 transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(26,92,42,0.08)" }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: "#f0faf1", color: "#1a5c2a" }}
                >
                  {v.icon}
                </div>
                <h4 className="font-semibold text-lg tracking-tight mb-2" style={{ color: "#0d3d1a" }}>
                  {v.title}
                </h4>
                <p className="text-[15px] text-gray-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
