import Image from "next/image";

const sdgs = [
  { number: 4,  title: "Quality Education" },
  { number: 11, title: "Sustainable Cities & Communities" },
  { number: 12, title: "Responsible Consumption & Production" },
  { number: 13, title: "Climate Action" },
  { number: 14, title: "Life Below Water" },
  { number: 15, title: "Life on Land" },
];

export default function Foundations() {
  return (
    <section id="foundations" className="py-28 sm:py-36" style={{ backgroundColor: "var(--surface-page)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Left-aligned editorial header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] mb-5" style={{ color: "var(--brand-mid)" }}>
            Our Foundations
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]" style={{ color: "var(--text-heading)" }}>
            Faith. Science. Action.
          </h2>
          <div className="mt-8 flex items-start gap-6">
            <div className="w-16 h-px mt-3 shrink-0" style={{ backgroundColor: "var(--brand-mid)" }} />
            <p className="text-lg leading-[1.65] font-light" style={{ color: "var(--text-muted)" }}>
              Rooted in the Catholic Church&apos;s call to care for creation through <span className="font-medium" style={{ color: "var(--text-body)" }}>Laudato Si&apos;</span>, and aligned with the United Nations&apos; <span className="font-medium" style={{ color: "var(--text-body)" }}>Sustainable Development Goals</span>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Laudato Si' Card */}
          <div
            className="rounded-3xl p-10 sm:p-12 flex flex-col relative overflow-hidden"
            style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
          >
            {/* Decorative watermark */}
            <div
              className="absolute -top-4 -right-2 text-[220px] font-serif leading-none select-none pointer-events-none"
              style={{ color: "var(--brand-mid)", opacity: 0.06 }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-8 relative" style={{ color: "var(--brand-mid)" }}>
              Laudato Si&apos; · 2015
            </p>

            <blockquote className="mb-8 relative">
              <p className="text-2xl font-semibold italic leading-[1.35] tracking-tight mb-5" style={{ color: "var(--text-heading)" }}>
                All of us can cooperate as instruments of God for the care of creation, each according to his or her own culture, experience, involvements and talents.
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-8 h-px" style={{ backgroundColor: "var(--brand-mid)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Pope Francis, §14</span>
              </footer>
            </blockquote>

            <p className="text-[15px] leading-relaxed pt-6 border-t mt-auto relative" style={{ color: "var(--text-body)", borderColor: "var(--border-subtle)" }}>
              <em>&ldquo;Praise be to you,&rdquo;</em> Pope Francis&apos;s encyclical on caring for our common home, calls every individual, community, and institution to take responsibility for the environment. For Lasallian schools, it is a spiritual mandate that directly informs our participation in LEADForEarth.
            </p>
          </div>

          {/* SDGs Card */}
          <div
            className="rounded-3xl p-10 sm:p-12 flex flex-col"
            style={{ backgroundColor: "var(--surface)", boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-5 mb-8">
              <Image
                src="/sdg/sdg-wheel.png"
                alt="UN Sustainable Development Goals Wheel"
                width={72}
                height={72}
                className="object-contain shrink-0"
              />
              <Image
                src="/sdg/sdg-un-emblem.png"
                alt="UN SDG Emblem"
                width={160}
                height={52}
                className="object-contain"
              />
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-6" style={{ color: "var(--brand-mid)" }}>
              Goals We Are Aligned With
            </p>

            <div className="grid grid-cols-3 gap-3">
              {sdgs.map((sdg) => (
                <div key={sdg.number} className="group">
                  <Image
                    src={`/sdg/sdg-${String(sdg.number).padStart(2, "0")}.png`}
                    alt={`SDG ${sdg.number}: ${sdg.title}`}
                    width={140}
                    height={140}
                    sizes="(min-width: 1024px) 140px, (min-width: 640px) 30vw, 30vw"
                    className="w-full object-contain rounded-xl transition-transform group-hover:-translate-y-0.5"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
