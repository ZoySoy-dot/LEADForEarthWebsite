const steps = [
  {
    number: "01",
    title: "Choose Your Action",
    description:
      "Each participating school selects an environmental action that's meaningful and feasible for its own community — there's no required activity, only a shared commitment.",
    color: "#1a5c2a",
  },
  {
    number: "02",
    title: "Act Within the Month",
    description:
      "Carry out your chosen action during the campaign month. The inaugural month is August 2026, with monthly mobilizations continuing across the district from then on.",
    color: "#2d8c3e",
  },
  {
    number: "03",
    title: "Post with #LEADforEarth",
    description:
      "Document your action on your school's official social media platforms using #LEADforEarth — no later than the last Friday of the campaign month.",
    color: "#1a5c2a",
  },
  {
    number: "04",
    title: "Track Your Impact",
    description:
      "Establish a baseline before your action day and compare it afterward — energy saved, waste diverted, funds raised, or whatever metric fits your activity.",
    color: "#2d8c3e",
  },
  {
    number: "05",
    title: "Form a Task Force",
    description:
      "A student-led LEAD for Earth team at each campus coordinates the monthly action, manages digital documentation, and keeps the cross-district conversation going.",
    color: "#1a5c2a",
  },
  {
    number: "06",
    title: "Reflect & Report",
    description:
      "Hold a short climate literacy discussion during the action day, then submit a standardized monthly report to the district coordinating committee.",
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
            How It Works
          </p>
          <h2 className="text-4xl font-extrabold mb-6" style={{ color: "#1a5c2a" }}>
            A District-Wide Monthly Campaign
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto text-lg">
            LEAD for Earth is a permanent, monthly commitment across all participating
            Lasallian schools — united not by uniformity, but by a shared hashtag and
            a shared mission.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.number}
              className="group rounded-2xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-200"
              style={{ backgroundColor: "#f7faf7" }}
            >
              <span
                className="text-4xl font-extrabold block mb-4 opacity-30"
                style={{ color: s.color }}
              >
                {s.number}
              </span>
              <h3 className="text-lg font-bold mb-3" style={{ color: "#1a5c2a" }}>
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div
          className="mt-16 rounded-3xl p-10 text-center text-white"
          style={{ background: "linear-gradient(135deg, #0d3d1a, #2d8c3e)" }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready to join the campaign?</h3>
          <p className="text-green-100 mb-6 max-w-lg mx-auto">
            See the full guidelines for participating schools, or reach out to coordinate
            with the district committee.
          </p>
          <a
            href="#guidelines"
            className="inline-block px-8 py-3 rounded-full font-semibold bg-white hover:opacity-90 transition-opacity duration-200"
            style={{ color: "#1a5c2a" }}
          >
            Read the Guidelines
          </a>
        </div>
      </div>
    </section>
  );
}
