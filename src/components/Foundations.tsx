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
    <section id="foundations" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start mb-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#2d8c3e" }}>
              Our Foundations
            </p>
            <h2 className="text-4xl font-extrabold leading-tight" style={{ color: "#1a5c2a" }}>
              Grounded in Faith and Global Goals
            </h2>
            <div className="mt-6 w-12 h-1 rounded-full" style={{ backgroundColor: "#2d8c3e" }} />
          </div>
          <p className="text-gray-600 text-lg leading-relaxed pt-1">
            LEADForEarth is rooted in two complementary frameworks: the Catholic Church's call
            to care for creation through <strong className="text-gray-800">Laudato Si'</strong> and
            the United Nations' <strong className="text-gray-800">Sustainable Development Goals</strong>.
            Together, they guide both the spirit and the direction of our work.
          </p>
        </div>

        {/* Laudato Si' + SDGs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-gray-200 pt-16">

          {/* Laudato Si' */}
          <div className="lg:pr-16 lg:border-r border-gray-200 mb-16 lg:mb-0">
            <p className="text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: "#2d8c3e" }}>
              Laudato Si' · Encyclical Letter, 2015
            </p>

            {/* Decorative quote mark */}
            <div className="text-8xl font-serif leading-none mb-2 select-none" style={{ color: "#2d8c3e", opacity: 0.2 }}>
              "
            </div>

            <blockquote className="-mt-4 mb-8">
              <p className="text-xl font-semibold italic leading-relaxed mb-5" style={{ color: "#1a5c2a" }}>
                All of us can cooperate as instruments of God for the care of creation, each
                according to his or her own culture, experience, involvements and talents.
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-8 h-px" style={{ backgroundColor: "#2d8c3e" }} />
                <span className="text-sm text-gray-500">Pope Francis, §14</span>
              </footer>
            </blockquote>

            <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-8">
              Laudato Si', meaning <em>"Praise be to you,"</em> is Pope Francis's encyclical
              on caring for our common home. It calls every individual, community, and institution
              to take responsibility for the environment. For Lasallian schools, it is a spiritual
              mandate that directly informs our participation in LEADForEarth.
            </p>
          </div>

          {/* SDGs */}
          <div className="lg:pl-16">

            {/* SDG Wheel + UN Emblem */}
            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100">
              <Image
                src="/sdg-wheel.png"
                alt="UN Sustainable Development Goals Wheel"
                width={90}
                height={90}
                className="object-contain shrink-0"
              />
              <div>
                <Image
                  src="/sdg-un-emblem.png"
                  alt="UN SDG Emblem"
                  width={200}
                  height={65}
                  className="object-contain"
                />
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#2d8c3e" }}>
              Goals We Are Aligned With
            </p>

            {/* SDG logo grid — 3 on top, 2 on bottom */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {sdgs.slice(0, 3).map((sdg) => (
                <div key={sdg.number} className="group">
                  <Image
                    src={`/sdg-${String(sdg.number).padStart(2, "0")}.png`}
                    alt={`SDG ${sdg.number}: ${sdg.title}`}
                    width={140}
                    height={140}
                    className="w-full object-contain rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {sdgs.slice(3).map((sdg) => (
                <div key={sdg.number} className="group">
                  <Image
                    src={`/sdg-${String(sdg.number).padStart(2, "0")}.png`}
                    alt={`SDG ${sdg.number}: ${sdg.title}`}
                    width={140}
                    height={140}
                    className="w-full object-contain rounded-lg"
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
