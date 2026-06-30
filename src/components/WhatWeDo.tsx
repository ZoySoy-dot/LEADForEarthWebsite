const programs = [
  {
    number: "01",
    title: "Environmental Education",
    description:
      "We deliver workshops, seminars, and immersive learning experiences that deepen ecological literacy among students and educators across Lasallian schools.",
    color: "#1a5c2a",
  },
  {
    number: "02",
    title: "Community Advocacy",
    description:
      "We amplify youth voices in environmental policy discussions, partnering with local governments, NGOs, and international bodies to push for systemic change.",
    color: "#2d8c3e",
  },
  {
    number: "03",
    title: "Eco-Action Projects",
    description:
      "From tree-planting drives and waste reduction campaigns to coastal clean-ups and urban gardening, we mobilize communities around tangible environmental projects.",
    color: "#1a5c2a",
  },
  {
    number: "04",
    title: "Leadership Formation",
    description:
      "Through our flagship EcoCamp and leadership programs, we form young Lasallians into passionate, skilled environmental leaders ready to serve their communities.",
    color: "#2d8c3e",
  },
  {
    number: "05",
    title: "Research & Innovation",
    description:
      "We support student-led environmental research and connect innovators with mentors and funding to develop solutions to local ecological challenges.",
    color: "#1a5c2a",
  },
  {
    number: "06",
    title: "Network & Partnerships",
    description:
      "We build a regional network of Lasallian environmental champions, fostering cross-school collaboration and partnerships with global sustainability organizations.",
    color: "#2d8c3e",
  },
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#2d8c3e" }}>
            What We Do
          </p>
          <h2 className="text-4xl font-extrabold mb-6" style={{ color: "#1a5c2a" }}>
            Our Programs & Initiatives
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto text-lg">
            We work across multiple dimensions of environmental action — from the classroom
            to the community, from local projects to regional advocacy.
          </p>
        </div>

        {/* Program grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => (
            <div
              key={p.number}
              className="group rounded-2xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-200"
              style={{ backgroundColor: "#f7faf7" }}
            >
              <span
                className="text-4xl font-extrabold block mb-4 opacity-30"
                style={{ color: p.color }}
              >
                {p.number}
              </span>
              <h3 className="text-lg font-bold mb-3" style={{ color: "#1a5c2a" }}>
                {p.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div
          className="mt-16 rounded-3xl p-10 text-center text-white"
          style={{ background: "linear-gradient(135deg, #0d3d1a, #2d8c3e)" }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready to make a difference?</h3>
          <p className="text-green-100 mb-6 max-w-lg mx-auto">
            Join the growing community of Lasallian environmental leaders and start
            your journey with LEADForEarth today.
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 rounded-full font-semibold bg-white hover:opacity-90 transition-opacity duration-200"
            style={{ color: "#1a5c2a" }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
