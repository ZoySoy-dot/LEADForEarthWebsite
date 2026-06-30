const values = [
  {
    icon: "🌱",
    title: "Rooted in Faith",
    description:
      "Inspired by the Lasallian charism, we approach environmental stewardship as a spiritual and moral responsibility.",
  },
  {
    icon: "🤝",
    title: "Community-Driven",
    description:
      "We build bridges across schools, communities, and organizations to multiply our collective impact.",
  },
  {
    icon: "💡",
    title: "Youth Empowerment",
    description:
      "We equip young people with the knowledge, skills, and confidence to lead real environmental change.",
  },
  {
    icon: "🌍",
    title: "Holistic Action",
    description:
      "From policy advocacy to on-the-ground projects, we take a comprehensive approach to healing our Earth.",
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
            LEADForEarth is a program under the Lasallian East Asia District, uniting
            Lasallian institutions across the region in a shared commitment to ecological
            responsibility and sustainable development.
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
              To develop Lasallian environmental leaders who are deeply committed to
              caring for creation — through education, community engagement, and
              transformative action that addresses the root causes of our ecological crisis.
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
              A world where Lasallian youth lead the way toward ecological conversion —
              communities living in harmony with the Earth, driven by justice,
              compassion, and a deep respect for all of creation.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
