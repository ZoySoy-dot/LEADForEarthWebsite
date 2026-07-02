const steps = [
  {
    number: "01",
    title: "Create Action",
    description:
      "Each participating school selects an environmental action that's meaningful and feasible for its own community.",
  },
  {
    number: "02",
    title: "Post with #LEADforEarth",
    description:
      "Document your action on your school's official social media platforms using #LEADforEarth, and share your story with the district committee.",
  },
  {
    number: "03",
    title: "Reflect & Report",
    description:
      "Hold a short climate literacy discussion during the action day, then submit a standardized report to the district coordinating committee.",
  },
  {
    number: "04",
    title: "Share Your Story",
    description:
      "The district committee will compile the stories and share them on the official LEADForEarth social media platforms, highlighting the collective impact of all participating schools.",
  },
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">

          {/* Left: sticky label + heading */}
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#2d8c3e" }}>
              How It Works
            </p>
            <h2 className="text-4xl font-extrabold leading-tight" style={{ color: "#1a5c2a" }}>
              A District-Wide Campaign
            </h2>
            <div className="mt-6 w-12 h-1 rounded-full" style={{ backgroundColor: "#2d8c3e" }} />
            <p className="mt-6 text-gray-500 leading-relaxed">
              Every school, every campus — one shared mission. Each step moves us closer to collective, visible impact.
            </p>
          </div>

          {/* Right: steps as vertical list */}
          <div>
            {steps.map((s, i) => (
              <div
                key={s.number}
                className={`flex gap-8 items-start ${i < steps.length - 1 ? "pb-10 mb-10 border-b border-gray-100" : ""}`}
              >
                <span
                  className="text-4xl font-extrabold shrink-0 leading-none pt-1"
                  style={{ color: "#2d8c3e", opacity: 0.25 }}
                >
                  {s.number}
                </span>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#1a5c2a" }}>
                    {s.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
