const suggestedActions = [
  {
    number: "01",
    title: "Campus-Wide Power-Down Hour",
    description:
      "Turn off non-essential lights and devices in classrooms and facilities for approximately one hour on your chosen action day. Simple, repeatable, and easy to measure with utility data.",
  },
  {
    number: "02",
    title: "Circular Economy Drive",
    description:
      "Students, faculty, and staff donate pre-loved, still-functional items to be sold at a student-organized community market. Proceeds support an environmental foundation; unsold goods go to partner communities.",
  },
];

export default function Guidelines() {
  return (
    <section id="guidelines" className="py-28" style={{ backgroundColor: "#f7faf7" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start mb-20">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#2d8c3e" }}>
              Guidelines
            </p>
            <h2 className="text-4xl font-extrabold leading-tight" style={{ color: "#1a5c2a" }}>
              How Schools Participate
            </h2>
            <div className="mt-6 w-12 h-1 rounded-full" style={{ backgroundColor: "#2d8c3e" }} />
          </div>
          <div className="space-y-5 text-gray-600 text-lg leading-relaxed pt-1">
            <p>
              Every campus commits to one thing: create action that helps the environment and
              document it on social media using{" "}
              <strong style={{ color: "#1a5c2a" }}>#LEADForEarth</strong>.
            </p>
            <p>
              Schools are free to adapt the suggested actions, combine them, or replace them
              entirely with something that fits their community better. The mission is shared;
              the method is yours.
            </p>
          </div>
        </div>

        {/* Suggested Action Tracks */}
        <div className="border-t border-gray-200 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#2d8c3e" }}>
                Suggested Action Tracks
              </p>
              <p className="text-gray-500 leading-relaxed">
                Two ready-made starting points. These are suggestions, not mandates.
              </p>
            </div>
            <div className="space-y-10">
              {suggestedActions.map((a, i) => (
                <div
                  key={a.title}
                  className={`flex gap-8 items-start ${i < suggestedActions.length - 1 ? "pb-10 border-b border-gray-100" : ""}`}
                >
                  <span
                    className="text-4xl font-extrabold shrink-0 leading-none pt-1"
                    style={{ color: "#2d8c3e", opacity: 0.25 }}
                  >
                    {a.number}
                  </span>
                  <div>
                    <h4 className="font-bold text-xl mb-2" style={{ color: "#1a5c2a" }}>
                      {a.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
