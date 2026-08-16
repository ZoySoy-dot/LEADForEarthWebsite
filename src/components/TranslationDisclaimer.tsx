"use client";

import { useEffect, useState } from "react";

// Small toast that only surfaces when the site is currently being translated
// (googtrans cookie present). Users can dismiss for the session; the state
// resets on reload so a fresh translation shows the disclaimer again.
export default function TranslationDisclaimer() {
  const [active, setActive] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    setActive(match ? match[1] : null);
  }, []);

  if (!active || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      translate="no"
      className="notranslate fixed bottom-20 left-4 right-4 sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-sm z-40 rounded-2xl px-4 py-3 flex items-start gap-3"
      style={{
        backgroundColor: "rgba(15,25,15,0.94)",
        color: "white",
        boxShadow: "0 16px 40px -12px rgba(0,0,0,0.4)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 flex-none mt-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <div className="flex-1 text-[12px] leading-snug">
        <p className="font-semibold">Machine translated</p>
        <p style={{ color: "rgba(255,255,255,0.78)" }}>
          Automatic translation via Google. May be inaccurate. Use the
          language menu to return to English.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notice"
        className="flex-none -mr-1 -mt-1 w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
      >
        <svg
          viewBox="0 0 24 24"
          width={12}
          height={12}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
