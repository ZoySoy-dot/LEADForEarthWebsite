const values = [
  {
    icon: "🕊️",
    title: "Spirit of Faith",
    description:
      "We discover God's presence in the nature we protect — every action is an expression of our relationship with the Creator who entrusted this Earth to our care.",
  },
  {
    icon: "🔥",
    title: "Zeal for Service",
    description:
      "We translate environmental concern into concrete action, approaching our work with generosity, creativity, and awareness of climate's impact on local communities.",
  },
  {
    icon: "🌏",
    title: "Communion in Mission",
    description:
      "Different campuses, different actions, one shared mission. We work as one global body of young Lasallians, supporting each other across continents.",
  },
];

export default function AboutUs() {
  return (
    <section id="about" style={{ backgroundColor: "#f7faf7" }} className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#2d8c3e" }}>
            About Us
          </p>
          <h2 className="text-4xl font-extrabold mb-6" style={{ color: "#1a5c2a" }}>
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto text-lg">
            LEAD for Earth is a youth-led initiative of the Lasallian East Asia District,
            uniting Lasallian institutions across the Philippines and Hong Kong in a
            shared, monthly commitment to ecological stewardship.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div
            className="rounded-2xl p-8 border-l-4"
            style={{ backgroundColor: "#e8f5e9", borderColor: "#1a5c2a" }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: "#1a5c2a" }}>
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To transform shared Lasallian values into tangible, measurable advocacy —
              empowering students across the district to take coordinated environmental
              action under one unified banner: <strong>#LEADforEarth</strong>.
            </p>
          </div>
          <div
            className="rounded-2xl p-8 border-l-4"
            style={{ backgroundColor: "#e8f5e9", borderColor: "#2d8c3e" }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: "#1a5c2a" }}>
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              A district where environmental action is a permanent monthly habit, not
              a one-time event — a replicable framework other Lasallian districts can
              follow, proving that Communion in Mission needs only shared commitment,
              not uniformity.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 text-center"
            >
              <div className="text-4xl mb-4">{v.icon}</div>
              <h4 className="font-bold text-lg mb-2" style={{ color: "#1a5c2a" }}>
                {v.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
