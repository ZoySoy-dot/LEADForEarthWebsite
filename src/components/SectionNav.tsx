"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  { label: "Home", short: "Home", href: "#home" },
  { label: "About", short: "About", href: "#about" },
  { label: "How It Works", short: "Steps", href: "#what-we-do" },
  { label: "Our Foundations", short: "Values", href: "#foundations" },
  { label: "Contact", short: "Contact", href: "#contact" },
];

export default function SectionNav() {
  const [visible, setVisible] = useState(false);
  const [scrolledHeader, setScrolledHeader] = useState(false);
  const [active, setActive] = useState(sections[0].href.slice(1));
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const activeButtonRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Sync with main Header's compressed state (matches Header.tsx threshold)
      setScrolledHeader(y > 12);

      // SectionNav reveals once user has scrolled past ~60% of the viewport (past Hero).
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

  // Keep the active pill in view when the pill row is horizontally scrollable (mobile).
  useEffect(() => {
    const btn = activeButtonRefs.current[active];
    const scroller = scrollerRef.current;
    if (!btn || !scroller) return;
    const btnRect = btn.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    if (btnRect.left < scrollerRect.left || btnRect.right > scrollerRect.right) {
      const offset = btn.offsetLeft - (scroller.clientWidth - btn.clientWidth) / 2;
      scroller.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    }
  }, [active]);

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
        className="mx-auto max-w-6xl px-3 sm:px-5 lg:px-8 mt-3"
        style={{ pointerEvents: visible ? "auto" : "none" }}
      >
        <div
          ref={scrollerRef}
          className="lfe-hide-scrollbar overflow-x-auto rounded-full mx-auto"
          style={{
            backgroundColor: "var(--header-bg-scrolled)",
            backdropFilter: "saturate(150%) blur(20px)",
            WebkitBackdropFilter: "saturate(150%) blur(20px)",
            boxShadow: "var(--shadow-card)",
            width: "fit-content",
            maxWidth: "100%",
          }}
        >
          <nav
            className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1.5"
            aria-label="On this page"
          >
            {sections.map((s) => {
              const isActive = active === s.href.slice(1);
              return (
                <a
                  key={s.href}
                  ref={(el) => { activeButtonRefs.current[s.href.slice(1)] = el; }}
                  href={s.href}
                  aria-current={isActive ? "location" : undefined}
                  className="px-3 sm:px-3.5 py-1.5 rounded-full text-[12px] sm:text-[12.5px] font-medium transition-colors duration-200 whitespace-nowrap shrink-0"
                  style={{
                    color: isActive ? "var(--text-inverse)" : "var(--text-body)",
                    backgroundColor: isActive ? "var(--brand)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "var(--overlay-hover-strong)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span className="sm:hidden">{s.short}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
