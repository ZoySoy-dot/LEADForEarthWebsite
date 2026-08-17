"use client";

import { useState } from "react";

type Category = {
  title: string;
  icon: React.ReactNode;
  items: string[];
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-5 h-5",
};

const CATEGORIES: Category[] = [
  {
    title: "Trees & Biodiversity",
    icon: (
      <svg {...iconProps}>
        <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z" />
        <path d="M12 22v-3" />
      </svg>
    ),
    items: [
      "Propagation and protection of native / endemic trees",
      "Birding activities",
      "Support biodiversity conservation efforts",
      "Nature camps",
    ],
  },
  {
    title: "Carbon & Climate",
    icon: (
      <svg {...iconProps}>
        <path d="M17.5 19a4.5 4.5 0 1 0-.5-8.98A6 6 0 0 0 5 12a4 4 0 0 0 1 7.87" />
      </svg>
    ),
    items: ["Project Carbon Neutral", "Low Carbon Footprint campaigns"],
  },
  {
    title: "Water Stewardship",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3c-3.5 4.5-6 8-6 11a6 6 0 0 0 12 0c0-3-2.5-6.5-6-11z" />
      </svg>
    ),
    items: ["Water conservation initiatives", "Rain harvesting"],
  },
  {
    title: "Urban Growing & Food",
    icon: (
      <svg {...iconProps}>
        <path d="M7 20h10" />
        <path d="M10 20c5.5-2.5.8-6.4 3-10" />
        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
        <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
      </svg>
    ),
    items: ["Urban gardening", "Composting", "Vermiculture", "Hydroponics"],
  },
  {
    title: "Waste & Circular Economy",
    icon: (
      <svg {...iconProps}>
        <path d="M7 19H5a2 2 0 0 1-1.7-3l3-5" />
        <path d="M14 5l1.5-2.5a2 2 0 0 1 3.4 0L21 6" />
        <path d="M17 19h2a2 2 0 0 0 1.7-3l-1.5-2.5" />
        <path d="M9 5L7 8" />
        <polyline points="4 11 7 8 10 11" />
        <polyline points="20 10 21 6 17 5" />
        <polyline points="10 19 14 19 12 22" />
      </svg>
    ),
    items: [
      "Cleanup drives",
      "Campaigns to reduce plastics",
      "Upcycling projects",
    ],
  },
  {
    title: "Community Wellbeing",
    icon: (
      <svg {...iconProps}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    items: [
      "Soup kitchens and feeding programs",
      "Campaigns addressing hunger",
      "Education caravans",
      "Alternative Learning Systems",
    ],
  },
  {
    title: "Advocacy & Awareness",
    icon: (
      <svg {...iconProps}>
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
    items: [
      "Awareness campaigns",
      "Gender sensitivity campaigns",
      "Gender equality initiatives",
      "DEI campaigns",
      "Peace education",
    ],
  },
];

export default function ActionIdeas() {
  const [open, setOpen] = useState(false);

  return (
    <div className="not-prose">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="action-ideas-panel"
        className="group w-full flex items-center justify-between gap-4 rounded-3xl px-6 sm:px-8 py-6 text-left transition-all duration-300"
        style={{
          backgroundColor: open ? "var(--brand)" : "var(--surface)",
          color: open ? "var(--text-inverse)" : "var(--brand)",
          boxShadow: open ? "var(--shadow-brand-strong)" : "var(--shadow-card)",
        }}
      >
        <div className="flex items-center gap-5 min-w-0">
          <span
            className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-colors"
            style={{
              backgroundColor: open ? "rgba(255,255,255,0.15)" : "var(--surface-accent)",
              color: open ? "var(--text-inverse)" : "var(--brand)",
            }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M12 2a7 7 0 0 0-4 12.7c.8.7 1 1.5 1 2.3v1h6v-1c0-.8.2-1.6 1-2.3A7 7 0 0 0 12 2z" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-lg sm:text-xl leading-tight tracking-tight">
              Need help choosing an environmental action?
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: open ? "rgba(255,255,255,0.75)" : "var(--text-muted)" }}
            >
              Browse ideas your campus can adapt, combine, or replace.
            </p>
          </div>
        </div>
        <svg
          viewBox="0 0 24 24"
          className={`shrink-0 w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        id="action-ideas-panel"
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATEGORIES.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--surface)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "var(--surface-accent)", color: "var(--brand)" }}
                      aria-hidden="true"
                    >
                      {c.icon}
                    </span>
                    <h5
                      className="font-semibold text-[15px] tracking-tight"
                      style={{ color: "var(--brand)" }}
                    >
                      {c.title}
                    </h5>
                  </div>
                  <ul className="space-y-2">
                    {c.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[13.5px] leading-snug"
                        style={{ color: "var(--text-body)" }}
                      >
                        <span
                          className="shrink-0 mt-1.5 w-1 h-1 rounded-full"
                          style={{ backgroundColor: "var(--brand-mid)" }}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-xs italic mt-5 text-center tracking-wide" style={{ color: "var(--text-subtle)" }}>
              Inspirations, not requirements. Adapt, combine, or design your own.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
