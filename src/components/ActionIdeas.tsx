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
        <path d="M12 22V12" />
        <path d="M12 12c-3-1-5-4-5-7 0-1 1-2 2-2 2 0 3 2 3 4" />
        <path d="M12 12c3-1 5-4 5-7 0-1-1-2-2-2-2 0-3 2-3 4" />
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
        <path d="M12 20V10" />
        <path d="M12 10c0-3 2-5 5-5-1 3-2 5-5 5z" />
        <path d="M12 12c0-3-2-5-5-5 1 3 2 5 5 5z" />
        <path d="M6 20h12" />
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
        <path d="M20.8 11.5a5 5 0 0 0-8.8-3.3 5 5 0 0 0-8.8 3.3c0 6 8.8 10.5 8.8 10.5s8.8-4.5 8.8-10.5z" />
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
        <path d="M3 11l14-7v16L3 13z" />
        <path d="M8 12v5a3 3 0 0 0 6 0" />
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
          background: open
            ? "linear-gradient(135deg, #1a5c2a 0%, #2d8c3e 100%)"
            : "#ffffff",
          color: open ? "#ffffff" : "#1a5c2a",
          boxShadow: open
            ? "0 20px 40px -12px rgba(26,92,42,0.35)"
            : "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(26,92,42,0.08)",
        }}
      >
        <div className="flex items-center gap-5 min-w-0">
          <span
            className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-colors"
            style={{
              backgroundColor: open ? "rgba(255,255,255,0.15)" : "#f0faf1",
              color: open ? "#ffffff" : "#1a5c2a",
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
              style={{ color: open ? "rgba(255,255,255,0.75)" : "#6b7280" }}
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
                  className="rounded-2xl bg-white p-6 transition-transform hover:-translate-y-0.5"
                  style={{
                    boxShadow:
                      "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px -4px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: "#f0faf1", color: "#1a5c2a" }}
                      aria-hidden="true"
                    >
                      {c.icon}
                    </span>
                    <h5
                      className="font-semibold text-[15px] tracking-tight"
                      style={{ color: "#1a5c2a" }}
                    >
                      {c.title}
                    </h5>
                  </div>
                  <ul className="space-y-2">
                    {c.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[13.5px] text-gray-600 leading-snug"
                      >
                        <span
                          className="shrink-0 mt-1.5 w-1 h-1 rounded-full"
                          style={{ backgroundColor: "#2d8c3e" }}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 italic mt-5 text-center tracking-wide">
              Inspirations, not requirements. Adapt, combine, or design your own.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
