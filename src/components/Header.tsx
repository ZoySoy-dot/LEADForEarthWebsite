"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const onGuidelines = pathname === "/guidelines";
  const onReport = pathname === "/report";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)",
          backdropFilter: "saturate(150%) blur(20px)",
          WebkitBackdropFilter: "saturate(150%) blur(20px)",
          boxShadow: scrolled
            ? "0 1px 0 rgba(0,0,0,0.04), 0 4px 16px -4px rgba(0,0,0,0.06)"
            : "0 1px 0 rgba(0,0,0,0.04)",
        }}
      >
        <div
          className="max-w-6xl mx-auto px-5 lg:px-8 flex items-center justify-between transition-all duration-300"
          style={{ height: scrolled ? 56 : 68 }}
        >
          {/* Brand */}
          <Link
            href={isHome ? "#home" : "/"}
            className="flex items-center gap-2 -ml-1"
            aria-label="LEADForEarth home"
          >
            <Image
              src="/logos/logo-icon.png"
              alt=""
              width={40}
              height={40}
              className="object-contain transition-transform duration-300"
              style={{ transform: scrolled ? "scale(0.9)" : "scale(1)" }}
              priority
            />
            <span
              className="text-[17px] font-semibold tracking-tight leading-none"
              style={{ color: "#1a5c2a" }}
            >
              LEAD<span style={{ color: "#111" }}>ForEarth</span>
            </span>
          </Link>

          {/* Desktop nav — page-level only */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            <Link
              href="/"
              aria-current={isHome ? "page" : undefined}
              className="px-4 py-2 rounded-full text-[13.5px] font-medium transition-colors duration-200"
              style={{
                color: isHome ? "#1a5c2a" : "#3a3a3a",
                backgroundColor: isHome ? "rgba(26,92,42,0.08)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isHome) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isHome) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Home
            </Link>

            <Link
              href="/guidelines"
              aria-current={onGuidelines ? "page" : undefined}
              className="px-4 py-2 rounded-full text-[13.5px] font-medium transition-colors duration-200"
              style={{
                color: onGuidelines ? "#1a5c2a" : "#3a3a3a",
                backgroundColor: onGuidelines ? "rgba(26,92,42,0.08)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!onGuidelines) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!onGuidelines) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Guidelines
            </Link>

            <Link
              href="/report"
              aria-current={onReport ? "page" : undefined}
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13.5px] font-semibold text-white transition-all duration-200 hover:-translate-y-px"
              style={{
                backgroundColor: onReport ? "#0d3d1a" : "#1a5c2a",
                boxShadow: onReport
                  ? "0 4px 14px -4px rgba(13,61,26,0.5), inset 0 0 0 1.5px rgba(255,255,255,0.15)"
                  : "0 4px 14px -4px rgba(26,92,42,0.45)",
              }}
            >
              Submit Report
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 -mr-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span
              className="block w-5 h-[1.5px] rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#1a5c2a",
                transform: menuOpen ? "translateY(4px) rotate(45deg)" : "translateY(0) rotate(0)",
              }}
            />
            <span
              className="block w-5 h-[1.5px] rounded-full transition-all duration-300"
              style={{
                backgroundColor: "#1a5c2a",
                transform: menuOpen ? "translateY(-4px) rotate(-45deg)" : "translateY(0) rotate(0)",
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(15,25,15,0.4)", backdropFilter: "blur(4px)" }}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed top-0 right-0 bottom-0 z-50 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <span className="text-[15px] font-semibold tracking-tight" style={{ color: "#1a5c2a" }}>
            Menu
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="px-4 py-4" aria-label="Mobile">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            aria-current={isHome ? "page" : undefined}
            className="block px-3 py-3 rounded-xl text-[15px] font-medium transition-colors"
            style={{
              color: isHome ? "#1a5c2a" : "#3a3a3a",
              backgroundColor: isHome ? "rgba(26,92,42,0.08)" : "transparent",
            }}
          >
            Home
          </Link>
          <Link
            href="/guidelines"
            aria-current={onGuidelines ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-3 rounded-xl text-[15px] font-medium transition-colors"
            style={{
              color: onGuidelines ? "#1a5c2a" : "#3a3a3a",
              backgroundColor: onGuidelines ? "rgba(26,92,42,0.08)" : "transparent",
            }}
          >
            Guidelines
          </Link>

          <div className="px-3 pt-4">
            <Link
              href="/report"
              aria-current={onReport ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-[15px] font-semibold text-white transition-all"
              style={{
                backgroundColor: onReport ? "#0d3d1a" : "#1a5c2a",
                boxShadow: "0 6px 20px -6px rgba(26,92,42,0.45)",
              }}
            >
              Submit Report
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
