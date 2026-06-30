import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0d3d1a 0%, #1a5c2a 50%, #2d8c3e 100%)",
      }}
    >
      {/* Decorative leaf shapes */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: "#4aab5a", transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
        style={{ background: "#4aab5a", transform: "translate(-30%, 30%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#a8d5b0" }}>
            A Lasallian Environmental Initiative
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Leading Change,
            <br />
            <span style={{ color: "#a8d5b0" }}>Healing the Earth.</span>
          </h1>
          <p className="text-lg text-green-100 leading-relaxed mb-8 max-w-lg">
            LEADForEarth empowers Lasallian youth to become environmental leaders —
            taking concrete action for a more sustainable and just world.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href="#about"
              className="px-8 py-3 rounded-full font-semibold text-white border-2 border-white hover:bg-white hover:text-green-900 transition-colors duration-200"
            >
              Learn More
            </a>
            <a
              href="#contact"
              className="px-8 py-3 rounded-full font-semibold text-green-900 bg-white hover:opacity-90 transition-opacity duration-200"
            >
              Get Involved
            </a>
          </div>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Image
              src="/leadforearth-logo.png"
              alt="LEADForEarth"
              width={200}
              height={200}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 30C1200 80 960 0 720 30C480 60 240 0 0 30L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
