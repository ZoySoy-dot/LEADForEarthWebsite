const schools = [
  { name: "De La Salle University – Manila Campus", short: "DLSU Manila", country: "Philippines" },
  { name: "De La Salle University – Laguna Campus", short: "DLSU Laguna", country: "Philippines" },
  { name: "De La Salle University – Dasmariñas", short: "DLSU-D", country: "Philippines" },
  { name: "De La Salle–College of Saint Benilde", short: "DLS-CSB", country: "Philippines" },
  { name: "De La Salle Santiago Zobel School", short: "DLSZ", country: "Philippines" },
  { name: "University of St. La Salle", short: "USLS", country: "Philippines" },
  { name: "St. Joseph School – La Salle", short: "SJSLS", country: "Philippines" },
  { name: "La Salle College Hong Kong", short: "LSC", country: "Hong Kong" },
];

export default function ParticipatingSchools() {
  return (
    <section id="schools" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#2d8c3e" }}>
            Participating Institutions
          </p>
          <h2 className="text-4xl font-extrabold mb-6" style={{ color: "#1a5c2a" }}>
            Eight Schools, One District
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto text-lg">
            LEAD for Earth brings together Lasallian institutions across the Philippines
            and Hong Kong — each campus mobilizing its own community under one shared
            mission.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {schools.map((s) => (
            <div
              key={s.short}
              className="rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: "#f7faf7" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold mb-4 text-white"
                style={{ backgroundColor: "#1a5c2a" }}
              >
                {s.short.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="font-bold text-sm leading-snug mb-2" style={{ color: "#1a5c2a" }}>
                {s.name}
              </h3>
              <p className="text-xs text-gray-500">{s.country}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
