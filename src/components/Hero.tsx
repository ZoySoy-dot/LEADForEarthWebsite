import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--hero-night)" }}
    >
      {/* Editorial botanical accent: top-right leaf-blob. Flat fill, no
          gradient; sits behind everything at low opacity to add depth. */}
      <svg
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-[520px] h-[520px] md:w-[680px] md:h-[680px] pointer-events-none select-none"
        viewBox="0 0 600 600"
        fill="none"
      >
        <path
          d="M480 60C560 120 590 240 550 350C520 435 430 500 320 505C210 510 130 460 100 370C70 285 105 190 190 130C275 70 400 20 480 60Z"
          style={{ fill: "var(--hero-botanical)" }}
          opacity="0.55"
        />
        <path
          d="M450 110C510 160 530 250 500 335C475 400 410 445 330 445C255 445 195 405 175 345C155 285 185 220 245 180C305 140 390 60 450 110Z"
          style={{ fill: "var(--brand)" }}
          opacity="0.28"
        />
      </svg>

      {/* Editorial botanical accent: bottom-left, mirrored organic form. */}
      <svg
        aria-hidden="true"
        className="absolute -bottom-32 -left-32 w-[560px] h-[560px] md:w-[720px] md:h-[720px] pointer-events-none select-none"
        viewBox="0 0 600 600"
        fill="none"
      >
        <path
          d="M120 540C40 480 10 360 50 250C80 165 170 100 280 95C390 90 470 140 500 230C530 315 495 410 410 470C325 530 200 600 120 540Z"
          style={{ fill: "var(--hero-botanical)" }}
          opacity="0.5"
        />
        <path
          d="M150 490C90 440 70 350 100 265C125 200 190 155 270 155C345 155 405 195 425 255C445 315 415 380 355 420C295 460 210 540 150 490Z"
          style={{ fill: "var(--brand)" }}
          opacity="0.25"
        />
      </svg>

      {/* Hairline orbital arcs, echo the SDG wheel roundness and give a
          global / hemisphere motif without shouting. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <ellipse
          cx="1000"
          cy="450"
          rx="640"
          ry="640"
          stroke="rgba(200,230,210,0.08)"
          strokeWidth="1"
        />
        <ellipse
          cx="1000"
          cy="450"
          rx="480"
          ry="480"
          stroke="rgba(200,230,210,0.05)"
          strokeWidth="1"
        />
        <ellipse
          cx="1000"
          cy="450"
          rx="820"
          ry="820"
          stroke="rgba(200,230,210,0.04)"
          strokeWidth="1"
        />
      </svg>

      {/* Film-grain texture: SVG turbulence gives a warm, tactile finish. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none select-none mix-blend-overlay"
        style={{ opacity: 0.35 }}
      >
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.35 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      {/* Main content: flex-col-reverse puts the SDG wheel above the copy on
          mobile so users get a visual anchor before the wall of text. */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col-reverse md:flex-row items-center gap-16">

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
            One District,
            <br />
            One Mission
            <br />
            for the <span style={{ color: "var(--brand-glow)" }}>Earth</span>.
          </h1>

          <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(230,244,234,0.92)" }}>
            <strong className="text-white font-semibold">LEADForEarth</strong> is a
            district-wide environmental campaign uniting Lasallian schools across East Asia.
            Each campus chooses its own action, and all of us post under one hashtag.
          </p>

          {/* Primary + secondary CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3 sm:gap-4 mb-8">
            <Link
              href="/report"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                color: "var(--text-inverse)",
                backgroundColor: "var(--brand)",
                boxShadow: "var(--shadow-brand-strong), inset 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            >
              Submit a Report
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <Link
              href="/community"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5"
              style={{
                boxShadow: "inset 0 0 0 1.5px rgba(200,230,210,0.55)",
              }}
            >
              See the Community
            </Link>
          </div>

          {/* Scroll affordance */}
          <a
            href="#about"
            className="inline-flex items-center gap-2 group"
            style={{ color: "rgba(200,230,210,0.85)" }}
          >
            <span
              className="text-xs uppercase tracking-[0.25em] font-light group-hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-inter), serif", letterSpacing: "0.25em" }}
            >
              Scroll to explore
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="motion-safe:animate-bounce group-hover:text-white transition-colors duration-300"
              style={{ animationDuration: "1.6s" }}
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>

          {/* Presented-by lockup: La Salle mark leads; hairline separates the
              secondary LEAD @ 15 anniversary badge. */}
          <div className="mt-10 flex items-center gap-4 justify-center md:justify-start">
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "rgba(200,230,210,0.85)" }}
            >
              Presented by
            </span>
            <Image
              src="/logos/La-Star-Salle_White.png"
              alt="Lasallian East Asia District"
              width={90}
              height={32}
              className="object-contain opacity-95"
            />
            <span
              aria-hidden="true"
              className="w-px h-6"
              style={{ backgroundColor: "rgba(200,230,210,0.22)" }}
            />
            <Image
              src="/logos/LEAD%20%40%2015.png"
              alt="LEAD @ 15"
              width={36}
              height={36}
              className="object-contain opacity-85"
            />
          </div>
        </div>

        {/* Logo with SDG wheel ring */}
        <div className="flex-shrink-0 relative w-[72vw] h-[72vw] max-w-[260px] max-h-[260px] sm:max-w-[320px] sm:max-h-[320px] md:w-[380px] md:h-[380px] md:max-w-none md:max-h-none flex items-center justify-center">
          {/* SDG wheel fills the container as the ring */}
          <Image
            src="/sdg/sdg-wheel.png"
            alt="UN Sustainable Development Goals"
            fill
            sizes="(min-width: 768px) 380px, (min-width: 640px) 320px, 72vw"
            className="object-contain"
            style={{ filter: "drop-shadow(0 0 32px rgba(40,130,80,0.45)) drop-shadow(0 0 16px rgba(20,80,160,0.25))" }}
          />
          {/* White logo circle centered inside the wheel */}
          <div
            className="relative z-10 w-[43vw] h-[43vw] max-w-[155px] max-h-[155px] sm:max-w-[190px] sm:max-h-[190px] md:w-[228px] md:h-[228px] md:max-w-none md:max-h-none rounded-full flex items-center justify-center"
            style={{
              // Logo lockup disc stays visually white in both themes so the
              // brand mark reads correctly on the dark hero.
              background: "#ffffff",
              boxShadow: "var(--shadow-lift)",
            }}
          >
            <div className="relative w-[34vw] h-[34vw] max-w-[120px] max-h-[120px] sm:max-w-[148px] sm:max-h-[148px] md:w-[175px] md:h-[175px] md:max-w-none md:max-h-none">
              <Image
                src="/logos/leadforearth-logo.png"
                alt="LEADForEarth"
                fill
                sizes="(min-width: 768px) 175px, (min-width: 640px) 148px, 34vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Horizon hairline: reads as an intentional edge between the night
          hero and the light AboutUs section. */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ backgroundColor: "var(--hero-hairline)" }}
      />
    </section>
  );
}
