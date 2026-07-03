"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#what-we-do" },
  { label: "Our Foundations", href: "#foundations" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [positions, setPositions] = useState<{ left: number; width: number }[]>([]);

  const measure = () => {
    const navEl = navRef.current;
    if (!navEl) return;
    const navRect = navEl.getBoundingClientRect();
    setPositions(
      linkRefs.current.map((el) => {
        if (!el) return { left: 0, width: 0 };
        const r = el.getBoundingClientRect();
        return { left: r.left - navRect.left, width: r.width };
      })
    );
  };

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const atBottom =
        window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50;

      if (atBottom) {
        setActiveSection(navLinks[navLinks.length - 1].href.slice(1));
        return;
      }

      let current = navLinks[0].href.slice(1);
      for (const link of navLinks) {
        const id = link.href.slice(1);
        const el = document.getElementById(id);
        if (el && el.offsetTop - 100 <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIndex = navLinks.findIndex((l) => l.href.slice(1) === activeSection);
  const pos = positions[activeIndex];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center">
          <Image
            src="/logos/leadforearth-logo.png"
            alt="LEADForEarth Logo"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
          <span
            className="text-xl font-bold leading-tight -ml-2"
            style={{ color: "#1a5c2a" }}
          >
            LEAD
            <span style={{ color: "#2d2d2d" }}>ForEarth</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden md:flex items-center gap-8 relative pb-1">
          {navLinks.map((link, i) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                ref={(el) => { linkRefs.current[i] = el; }}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 hover:text-green-700"
                style={{ color: isActive ? "#1a5c2a" : "#2d2d2d" }}
              >
                {link.label}
              </a>
            );
          })}

          {/* Sliding underline indicator */}
          {pos && (
            <span
              className="absolute bottom-0 left-0 h-0.5 rounded-full"
              style={{
                width: pos.width,
                transform: `translateX(${pos.left}px)`,
                backgroundColor: "#1a5c2a",
                transition: "transform 350ms cubic-bezier(0.4, 0, 0.2, 1), width 350ms cubic-bezier(0.4, 0, 0.2, 1)",
                willChange: "transform, width",
              }}
            />
          )}

          <div className="ml-2 pl-6 border-l border-gray-200">
            <Link
              href="/report"
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 hover:-translate-y-px"
              style={{
                borderColor: "#1a5c2a",
                color: "#1a5c2a",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(26,92,42,0.07)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Submit Report
            </Link>
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-4">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 text-sm font-medium border-b border-gray-100 last:border-0 hover:text-green-700"
                style={{ color: isActive ? "#1a5c2a" : "#2d2d2d", fontWeight: isActive ? 700 : undefined }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
          <div className="mt-4">
            <Link
              href="/report"
              className="block text-center px-5 py-2 rounded-full text-sm font-medium border transition-colors duration-200"
              style={{ borderColor: "#1a5c2a", color: "#1a5c2a" }}
              onClick={() => setMenuOpen(false)}
            >
              Submit Report
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
