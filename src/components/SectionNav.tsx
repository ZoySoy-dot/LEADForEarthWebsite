"use client";

import { useEffect, useState } from "react";

const sections = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#what-we-do" },
  { label: "Our Foundations", href: "#foundations" },
  { label: "Contact", href: "#contact" },
];

export default function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [scrolledHeader, setScrolledHeader] = useState(false);
  const [active, setActive] = useState(sections[0].href.slice(1));

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Sync with main Header's compressed state (matches Header.tsx threshold)
      setScrolledHeader(y > 12);

      // SectionNav reveals once user has scrolled past ~2/3 of the viewport (past Hero).
      const heroThreshold = window.innerHeight * 0.6;
      setVisible(y > heroThreshold);

      // Scroll-spy: pick the last section whose top has passed the offset band.
      const offset = (y > 12 ? 56 : 68) + 60; // header height + subnav breathing room
      const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 40;
      if (atBottom) {
        setActive(sections[sections.length - 1].href.slice(1));
        return;
      }
      let current = sections[0].href.slice(1);
      for (const s of sections) {
        const id = s.href.slice(1);
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed left-0 right-0 z-40 transition-all duration-300 pointer-events-none"
      style={{
        top: scrolledHeader ? 56 : 68,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
      }}
      aria-hidden={!visible}
    >
      <div
        className="mx-auto max-w-6xl px-5 lg:px-8"
        style={{ pointerEvents: visible ? "auto" : "none" }}
      >
        <nav
          className="mt-3 rounded-full flex items-center justify-center gap-1 px-2 py-1.5 mx-auto w-fit"
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            backdropFilter: "saturate(150%) blur(20px)",
            WebkitBackdropFilter: "saturate(150%) blur(20px)",
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.12)",
          }}
          aria-label="On this page"
        >
          {sections.map((s) => {
            const isActive = active === s.href.slice(1);
            return (
              <a
                key={s.href}
                href={s.href}
                aria-current={isActive ? "location" : undefined}
                className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors duration-200 whitespace-nowrap"
                style={{
                  color: isActive ? "#ffffff" : "#3a3a3a",
                  backgroundColor: isActive ? "#1a5c2a" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {s.label}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
