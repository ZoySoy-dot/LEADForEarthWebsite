import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Explore: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#what-we-do" },
    { label: "Contact", href: "#contact" },
  ],
  Campaign: [
    { label: "Guidelines", href: "/guidelines" },
    { label: "Our Community", href: "/community" },
    { label: "Submit a Report", href: "/report" },
    { label: "#LEADforEarth", href: "#home" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--surface)", borderTop: "1px solid var(--border-subtle)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 md:gap-16 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-5">
              <Image
                src="/logos/logo-icon.png"
                alt="LEADForEarth Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ color: "var(--brand)" }}
              >
                LEAD
                <span style={{ color: "var(--text-primary)" }}>ForEarth</span>
              </span>
            </Link>
            <p className="text-[15px] leading-relaxed max-w-xs mb-6 font-light" style={{ color: "var(--text-muted)" }}>
              A district-wide environmental campaign uniting Lasallian schools across East Asia under one shared hashtag.
            </p>
            <a
              href="mailto:LeadForEarth@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--brand)" }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="2 6 12 13 22 6" />
              </svg>
              LeadForEarth@gmail.com
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] mb-5" style={{ color: "var(--text-subtle)" }}>
                {heading}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors text-[color:var(--text-body)] hover:text-[color:var(--brand-strong)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            © {new Date().getFullYear()} LEADForEarth. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Image
              src="/logos/La-Star-Salle_White.png"
              alt="Lasallian East Asia District"
              width={90}
              height={32}
              className="object-contain opacity-70"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(23%) sepia(35%) saturate(1600%) hue-rotate(89deg) brightness(93%) contrast(85%)",
              }}
            />
            <Image
              src="/logos/LEAD%20%40%2015.png"
              alt="LEAD @ 15"
              width={40}
              height={40}
              className="object-contain opacity-80"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
