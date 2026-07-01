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
                  { letter: "E", word: "East" },
                  { letter: "A", word: "Asia" },
                  { letter: "D", word: "District" },
                ].map(({ letter, word }) => (
                  <li key={letter} className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-white text-lg flex-shrink-0">
                      {letter}
                    </span>
                    <span className="text-lg font-medium">{word}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-green-100 mt-6 leading-relaxed">
                LEAD for Earth is the environmental initiative of the Lasallian East
                Asia District — a network of Lasallian schools across the Philippines
                and Hong Kong.
              </p>
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
                <strong style={{ color: "#2d2d2d" }}>LEAD for Earth</strong> emerged from
                the first International LEAD EcoCamp as a joint effort to move our
                schools from environmental awareness to concrete, repeatable action.
              </p>
              <p>
                Rather than a single annual event, it is a permanent monthly commitment.
                Each participating campus carries out its chosen environmental action
                within a shared campaign month, documenting it publicly under
                <strong style={{ color: "#2d2d2d" }}> #LEADforEarth</strong>.
              </p>
              <p>
                Grounded in the Lasallian core value of <em>Communion in Mission</em>,
                the initiative trusts each institution to contribute in the way that
                is most meaningful to its community — united not by uniformity, but by
                a shared and enduring mission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
