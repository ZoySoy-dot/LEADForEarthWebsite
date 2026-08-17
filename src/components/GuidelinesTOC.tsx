"use client";

import { useEffect, useState } from "react";

type Section = { id: string; num: string; title: string };

export default function GuidelinesTOC({ sections }: { sections: readonly Section[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer whichever visible section is nearest the top viewport band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Guidelines contents" className="relative">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-5 pl-4" style={{ color: "var(--text-subtle)" }}>
        Contents
      </p>
      {/* Vertical rail */}
      <div className="absolute left-3 top-9 bottom-0 w-px" style={{ backgroundColor: "var(--border-input)" }} aria-hidden="true" />

      <ul className="space-y-1">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="relative">
              {/* Active indicator dot on the rail */}
              <span
                className="absolute left-3 top-3 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isActive ? "var(--brand)" : "transparent",
                  boxShadow: isActive ? "0 0 0 4px var(--border-brand-soft)" : "none",
                }}
                aria-hidden="true"
              />
              <a
                href={`#${s.id}`}
                className="block pl-8 pr-2 py-1.5 text-sm rounded-lg transition-colors"
                style={{
                  color: isActive ? "var(--brand)" : "var(--text-muted)",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {s.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
