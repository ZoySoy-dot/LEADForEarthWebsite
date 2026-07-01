const suggestedActions = [
  {
    icon: "💡",
    title: "Campus-Wide Power-Down Hour",
    description:
      "Turn off non-essential lights and devices in classrooms and facilities for approximately one hour on your chosen action day. Simple, repeatable, and easy to measure with utility data.",
  },
  {
    icon: "♻️",
    title: "Circular Economy Drive",
    description:
      "Students, faculty, and staff donate pre-loved, still-functional items to be sold at a student-organized community market. Proceeds support an environmental foundation (e.g., Haribon); unsold goods go to partner communities.",
  },
];

const commitments = [
  {
    label: "The shared commitment",
    text: "Carry out your chosen environmental action within the campaign month and document it on your school's official social media using #LEADforEarth.",
  },
  {
    label: "The deadline",
    text: "Posts must be up no later than the last Friday of the campaign month.",
  },
  {
    label: "The flexibility",
    text: "Schools are free to adapt the suggested actions, combine them, or replace them entirely with something that fits their community better.",
  },
  {
    label: "The campaign month",
    text: "August 2026 is the inaugural month, with monthly mobilizations continuing across the district from then on.",
  },
];

export default function Guidelines() {
  return (
    <section
      id="guidelines"
      className="py-24"
      style={{ backgroundColor: "#f7faf7" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#2d8c3e" }}>
            Guidelines
          </p>
          <h2 className="text-4xl font-extrabold mb-6" style={{ color: "#1a5c2a" }}>
            How Schools Participate
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto text-lg">
            The success of LEAD for Earth depends on genuine, collective effort from
            participating Lasallian institutions. Here is what every campus commits to —
            and what they're free to shape on their own.
          </p>
        </div>

        {/* Commitments */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {commitments.map((c) => (
            <div
              key={c.label}
              className="bg-white rounded-2xl p-6 shadow-sm border-l-4"
              style={{ borderColor: "#2d8c3e" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "#2d8c3e" }}
              >
                {c.label}
              </p>
              <p className="text-gray-700 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Suggested actions */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-3 text-center" style={{ color: "#1a5c2a" }}>
            Suggested Action Tracks
          </h3>
          <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
            Two starting points for schools that want a ready-made framework. These are
            suggestions, not mandates.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {suggestedActions.map((a) => (
              <div
                key={a.title}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-4xl mb-4">{a.icon}</div>
                <h4 className="text-lg font-bold mb-3" style={{ color: "#1a5c2a" }}>
                  {a.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Task force + reporting block */}
        <div
          className="rounded-3xl p-10 text-white"
          style={{ background: "linear-gradient(135deg, #0d3d1a, #2d8c3e)" }}
        >
          <h3 className="text-2xl font-bold mb-6">For Each Participating Campus</h3>
          <div className="grid md:grid-cols-2 gap-8 text-green-100 leading-relaxed">
            <div>
              <h4 className="font-bold text-white mb-2">Form a Task Force</h4>
              <p className="text-sm">
                Establish a student-led LEAD for Earth team to coordinate the monthly
                action, manage social documentation, and maintain cross-district
                communication. Build in onboarding so the work outlives any single cohort.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">Track & Report</h4>
              <p className="text-sm">
                Establish a baseline before your action day, measure the result afterward,
                and submit a brief standardized report to the district coordinating
                committee at the close of each campaign month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
