"use client";

import { useEffect, useState } from "react";

// Reads the current effective theme. The default (no data-theme on <html>)
// follows the OS via CSS media query, so we consult matchMedia when no
// explicit override is present.
type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("lfe-theme", next);
  } catch {
    /* storage may be disabled */
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // On mount: if the user has a stored override, apply it (this sets
    // data-theme, overriding the CSS media-query default). Otherwise sync
    // our display state to whatever CSS is currently showing.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("lfe-theme");
    } catch {
      /* storage disabled */
    }
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
      setTheme(stored);
    } else {
      setTheme(readTheme());
    }
    setMounted(true);

    // Keep the icon in sync if the OS theme flips while the page is open and
    // the user hasn't overridden. CSS already flips the colors; this just
    // updates the sun/moon glyph.
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      let s: string | null = null;
      try {
        s = localStorage.getItem("lfe-theme");
      } catch {
        /* storage disabled */
      }
      if (s === "dark" || s === "light") return;
      setTheme(readTheme());
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  // Render a stable, no-op button pre-hydration so the layout doesn't shift.
  const label = mounted
    ? theme === "dark"
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="fixed bottom-[4.5rem] left-4 z-40 inline-flex items-center justify-center w-11 h-11 rounded-full transition-all hover:-translate-y-px"
      style={{
        color: "var(--brand-strong)",
        backgroundColor: "var(--surface-elevated)",
        backdropFilter: "saturate(150%) blur(12px)",
        WebkitBackdropFilter: "saturate(150%) blur(12px)",
        boxShadow:
          "var(--shadow-brand), inset 0 0 0 1px var(--border-brand-soft)",
      }}
    >
      {/* Sun */}
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{
          display: mounted && theme === "dark" ? "block" : "none",
        }}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      {/* Moon */}
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{
          display: !mounted || theme === "light" ? "block" : "none",
        }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
