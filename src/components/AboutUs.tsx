function LeafIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path
        d="M8 32C8 32 16 32 21 27C26 22 27 14 27 14C27 14 35 13 37 8C32 2 22 5 20 11C20 11 14 12 11 17C8 22 8 32 8 32Z"
        fill="#2d8c3e" fillOpacity="0.15" stroke="#2d8c3e" strokeWidth="1.5" strokeLinejoin="round"
      />
      <path d="M8 32L20 20" stroke="#2d8c3e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SproutIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M20 36V20" stroke="#2d8c3e" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M6 12C6 12 6 22 20 22C20 22 20 12 6 12Z"
        fill="#2d8c3e" fillOpacity="0.15" stroke="#2d8c3e" strokeWidth="1.5" strokeLinejoin="round"
      />
      <path
        d="M34 6C34 6 34 18 20 18C20 18 20 6 34 6Z"
        fill="#2d8c3e" fillOpacity="0.15" stroke="#2d8c3e" strokeWidth="1.5" strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="14" stroke="#2d8c3e" strokeWidth="1.5" />
      <ellipse cx="20" cy="20" rx="6" ry="14" stroke="#2d8c3e" strokeWidth="1.5" />
      <path d="M6.5 16h27M6.5 24h27" stroke="#2d8c3e" strokeWidth="1" strokeLinecap="round" />
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
      "We translate concern into concrete action, approaching our work with generosity, creativity, and awareness of climate's impact on local communities.",
  },
  {
    icon: <GlobeIcon />,
    title: "Communion in Mission",
    description:
      "Different campuses, different actions, one shared mission. We support each other across continents as one global body of young Lasallians.",
  },
];

export default function AboutUs() {
  return (
    <section id="about" style={{ backgroundColor: "#f7faf7" }} className="py-28">


      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">

        {/* Header + Description */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start mb-20">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#2d8c3e" }}>
              What is LEADForEarth?
            </p>
            <h2 className="text-4xl font-extrabold leading-tight" style={{ color: "#1a5c2a" }}>
              A Movement Rooted in Faith and Action
            </h2>
            <div className="mt-6 w-12 h-1 rounded-full" style={{ backgroundColor: "#2d8c3e" }} />
          </div>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              <strong className="text-gray-800">LEADForEarth</strong> is the environmental initiative of the Lasallian East Asia District, a network of Lasallian schools across the region committed to sustainability and environmental protection. Emerging from the first International LEAD EcoCamp, the program is a joint effort designed to move our institutions from simple environmental awareness to concrete, repeatable action.
            </p>
            <p>
              This continuous movement brings together our diverse sustainability commitments under a single banner:{" "}
              <strong style={{ color: "#1a5c2a" }}>#LEADforEarth</strong>. By leveraging social media, we aim to showcase the tangible steps our schools and communities are taking. Highlighting these collective efforts proves that real, collaborative change is happening while inspiring a broader audience to join the cause.
            </p>
            <p>
              Grounded in the Lasallian core value of <em>Communion in Mission</em>, LEADForEarth trusts each institution to contribute in a way that is most meaningful to its local context. Ultimately, we are united not by strict uniformity, but by a shared and enduring mission to protect our planet.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-b border-gray-200 py-14 mb-20">
          <div className="lg:pr-16 lg:border-r border-gray-200 mb-12 lg:mb-0">
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#2d8c3e" }}>
              Our Mission
            </p>
            <p className="text-2xl font-bold leading-snug" style={{ color: "#1a5c2a" }}>
              To empower Lasallian students across East Asia to take coordinated environmental
              action, united under one banner:{" "}
              <span style={{ color: "#2d8c3e" }}>#LEADforEarth</span>.
            </p>
          </div>
          <div className="lg:pl-16">
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "#2d8c3e" }}>
              Our Vision
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              A district where students are empowered to act, and where the Lasallian community stands
              united in ecological stewardship. A future where environmental action is{" "}
              <em>seen</em>, celebrated, and never forgotten.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {values.map((v) => (
            <div key={v.title}>
              <div className="mb-4">{v.icon}</div>
              <h4 className="font-bold text-xl mb-3" style={{ color: "#1a5c2a" }}>
                {v.title}
              </h4>
              <div className="w-8 h-0.5 mb-4" style={{ backgroundColor: "#2d8c3e" }} />
              <p className="text-gray-600 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
