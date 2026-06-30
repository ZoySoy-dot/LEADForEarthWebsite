export default function WhatIsLEAD() {
  return (
    <section id="what-is-lead" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Decorative block */}
          <div className="relative">
            <div
              className="rounded-3xl p-10 text-white"
              style={{ background: "linear-gradient(135deg, #1a5c2a, #2d8c3e)" }}
            >
              <div className="text-6xl mb-6">🌿</div>
              <h3 className="text-2xl font-bold mb-4">LEAD Acronym</h3>
              <ul className="space-y-3 text-green-100">
                {[
                  { letter: "L", word: "Lasallian" },
                  { letter: "E", word: "Environmental" },
                  { letter: "A", word: "Action" },
                  { letter: "D", word: "Development" },
                ].map(({ letter, word }) => (
                  <li key={letter} className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-white text-lg flex-shrink-0">
                      {letter}
                    </span>
                    <span className="text-lg font-medium">{word}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Decorative accent */}
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl -z-10"
              style={{ backgroundColor: "#a8d5b0" }}
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#2d8c3e" }}>
              What is LEADForEarth?
            </p>
            <h2 className="text-4xl font-extrabold leading-tight mb-6" style={{ color: "#1a5c2a" }}>
              A Movement Rooted in Faith and Action
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong style={{ color: "#2d2d2d" }}>LEADForEarth</strong> is a Lasallian youth-led
                environmental initiative that brings together students, educators, and communities
                to address the urgent challenges of our ecological crisis.
              </p>
              <p>
                Grounded in the Lasallian tradition of faith, service, and community, LEADForEarth
                cultivates a generation of young environmental leaders who are equipped,
                inspired, and committed to caring for our common home.
              </p>
              <p>
                Through education, advocacy, and hands-on programs, we bridge the gap between
                environmental awareness and meaningful action — because the Earth needs leaders now.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
