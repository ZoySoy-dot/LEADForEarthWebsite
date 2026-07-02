import Image from "next/image";

const stars = [
  [80,28,1.2],[155,14,1],[240,42,0.8],[330,18,1.1],[420,35,0.9],[510,12,1.3],
  [600,45,0.8],[695,22,1],[780,38,0.7],[870,16,1.2],[960,40,0.9],[1050,20,1.1],
  [1140,48,0.8],[1230,15,1],[1320,36,0.9],[1400,24,1.2],[60,85,0.7],[180,72,1],
  [290,95,0.8],[400,68,1.1],[520,88,0.7],[640,75,0.9],[760,92,0.8],[880,70,1],
  [1000,86,0.7],[1110,74,0.9],[1220,90,0.8],[1350,78,1],[120,140,0.6],[250,128,0.8],
  [380,148,0.6],[500,132,0.7],[630,145,0.6],[750,130,0.8],[880,150,0.6],[1010,136,0.7],
  [1140,148,0.6],[1270,134,0.8],[1390,146,0.6],[45,195,0.5],[175,182,0.7],[310,200,0.5],
  [450,188,0.6],[590,202,0.5],[730,186,0.7],[865,198,0.5],[1000,184,0.6],
  [1130,200,0.5],[1260,188,0.7],[1400,196,0.5],
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Sky → Forest → Ocean layered background */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 110% 50% at 50% 0%, rgba(40,90,200,0.22) 0%, transparent 100%)",
            "radial-gradient(ellipse 60% 35% at 18% 52%, rgba(20,110,45,0.35) 0%, transparent 100%)",
            "radial-gradient(ellipse 80% 45% at 72% 95%, rgba(10,65,130,0.35) 0%, transparent 100%)",
            "linear-gradient(180deg, #020810 0%, #060e22 12%, #091830 24%, #08181c 36%, #091e0e 46%, #0d3d1a 58%, #083040 72%, #051828 86%, #020810 100%)",
          ].join(", "),
        }}
      />

      {/* Stars */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none select-none"
        style={{ height: "42%" }}
        viewBox="0 0 1440 380"
        preserveAspectRatio="xMidYMin slice"
      >
        {stars.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity={0.35 + (i % 5) * 0.1} />
        ))}
        {/* Subtle Milky Way band */}
        <ellipse cx="720" cy="120" rx="680" ry="30" fill="white" opacity="0.015"/>
      </svg>

      {/* Tree silhouette horizon */}
      <div
        className="absolute left-0 right-0 pointer-events-none select-none"
        style={{ top: "40%", opacity: 0.35 }}
      >
        <svg width="100%" height="140" viewBox="0 0 1440 140" preserveAspectRatio="xMidYMax slice">
          {/* Left forest */}
          <path d="M0 140 L0 105 L18 68 L36 105 L36 140Z" fill="#071a0a"/>
          <path d="M28 140 L28 88 L52 48 L76 88 L76 140Z" fill="#091e0c"/>
          <path d="M62 140 L62 98 L82 62 L102 98 L102 140Z" fill="#071a0a"/>
          <path d="M88 140 L88 80 L118 36 L148 80 L148 140Z" fill="#0a2410"/>
          <path d="M130 140 L130 95 L152 58 L174 95 L174 140Z" fill="#071a0a"/>
          <path d="M158 140 L158 100 L180 62 L202 100 L202 140Z" fill="#091e0c"/>
          <path d="M188 140 L188 85 L215 42 L242 85 L242 140Z" fill="#071a0a"/>
          <path d="M228 140 L228 102 L248 66 L268 102 L268 140Z" fill="#0a2410"/>
          <path d="M255 140 L255 90 L282 50 L309 90 L309 140Z" fill="#071a0a"/>
          <path d="M292 140 L292 108 L310 75 L328 108 L328 140Z" fill="#091e0c"/>
          <path d="M315 140 L315 92 L340 52 L365 92 L365 140Z" fill="#071a0a"/>
          <path d="M350 140 L350 110 L368 78 L386 110 L386 140Z" fill="#0a2410"/>
          {/* Right forest */}
          <path d="M1440 140 L1440 105 L1422 68 L1404 105 L1404 140Z" fill="#071a0a"/>
          <path d="M1412 140 L1412 88 L1388 48 L1364 88 L1364 140Z" fill="#091e0c"/>
          <path d="M1368 140 L1368 98 L1348 62 L1328 98 L1328 140Z" fill="#071a0a"/>
          <path d="M1335 140 L1335 80 L1305 36 L1275 80 L1275 140Z" fill="#0a2410"/>
          <path d="M1280 140 L1280 95 L1258 58 L1236 95 L1236 140Z" fill="#071a0a"/>
          <path d="M1242 140 L1242 100 L1220 62 L1198 100 L1198 140Z" fill="#091e0c"/>
          <path d="M1202 140 L1202 85 L1175 42 L1148 85 L1148 140Z" fill="#071a0a"/>
          <path d="M1153 140 L1153 102 L1133 66 L1113 102 L1113 140Z" fill="#0a2410"/>
          <path d="M1118 140 L1118 90 L1091 50 L1064 90 L1064 140Z" fill="#071a0a"/>
          <path d="M1068 140 L1068 108 L1050 75 L1032 108 L1032 140Z" fill="#091e0c"/>
          <path d="M1035 140 L1035 92 L1010 52 L985 92 L985 140Z" fill="#071a0a"/>
          <path d="M988 140 L988 110 L970 78 L952 110 L952 140Z" fill="#0a2410"/>
          {/* Ground fill */}
          <rect x="0" y="120" width="1440" height="20" fill="#071a0a"/>
        </svg>
      </div>

      {/* Water ripples */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none select-none"
        style={{ top: "68%" }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMid slice">
          {[
            [0, 0.06], [50, 0.05], [100, 0.07], [150, 0.05], [200, 0.06],
            [260, 0.04], [320, 0.05], [380, 0.04], [440, 0.05],
          ].map(([y, op], i) => (
            <path
              key={i}
              d={`M0 ${y} Q360 ${(y as number) + (i % 2 === 0 ? -10 : 10)} 720 ${y} Q1080 ${(y as number) + (i % 2 === 0 ? 10 : -10)} 1440 ${y}`}
              stroke="white" strokeWidth="0.7" fill="none" opacity={op}
            />
          ))}
        </svg>
      </div>

      {/* Dot-grid texture */}
      <div className="absolute inset-0 pointer-events-none select-none" style={{ opacity: 0.025 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16">

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
            One District,
            <br />
            <span style={{ color: "#a8d5b0" }}>One Mission</span>
            <br />
            for the Earth.
          </h1>

          <p className="text-lg leading-relaxed mb-10 max-w-lg" style={{ color: "rgba(200,230,210,0.8)" }}>
            <strong className="text-white font-semibold">LEADForEarth</strong> is a monthly,
            district-wide environmental campaign uniting Lasallian schools across East Asia.
            Each campus chooses its own action, all of us posting under one hashtag.
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href="#about"
              className="px-8 py-3.5 rounded-full font-semibold text-white border border-white/25 hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm"
            >
              Learn More
            </a>
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full font-semibold transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#a8d5b0", color: "#071a0a" }}
            >
              Get Involved
            </a>
          </div>
        </div>

        {/* Logo with SDG wheel ring */}
        <div className="flex-shrink-0 relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] flex items-center justify-center">
          {/* SDG wheel fills the container as the ring */}
          <Image
            src="/sdg-wheel.png"
            alt="UN Sustainable Development Goals"
            fill
            sizes="(min-width: 768px) 380px, 320px"
            className="object-contain"
            style={{ filter: "drop-shadow(0 0 24px rgba(40,130,80,0.35)) drop-shadow(0 0 12px rgba(20,80,160,0.2))" }}
          />
          {/* White logo circle centered inside the wheel */}
          <div
            className="relative z-10 w-[190px] h-[190px] md:w-[228px] md:h-[228px] rounded-full flex items-center justify-center"
            style={{
              background: "white",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            <Image
              src="/leadforearth-logo.png"
              alt="LEADForEarth"
              width={175}
              height={175}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

    </section>
  );
}
