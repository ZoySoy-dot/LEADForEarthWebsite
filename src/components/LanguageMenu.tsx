"use client";

import { useEffect, useRef, useState } from "react";

type Language = { code: string; label: string; note: string };

// English first (original). Remaining 7 items cover the LEAD district's
// sectors. Two Chinese variants: Traditional for HK, Simplified for SG's
// Chinese-language readers.
const LANGUAGES: readonly Language[] = [
  { code: "en", label: "English", note: "Original" },
  { code: "zh-TW", label: "繁體中文", note: "Hong Kong" },
  { code: "zh-CN", label: "简体中文", note: "Singapore" },
  { code: "ja", label: "日本語", note: "Japan" },
  { code: "ms", label: "Bahasa Melayu", note: "Malaysia" },
  { code: "tl", label: "Filipino", note: "Philippines" },
  { code: "my", label: "မြန်မာ", note: "Myanmar" },
  { code: "th", label: "ภาษาไทย", note: "Thailand" },
];

function readCurrentLang(): string {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  return match ? match[1] : "en";
}

// Google respects the `googtrans` cookie on load. We clear it (all domain
// scopes) then set the new value so the widget picks it up after reload.
// Setting on both bare and dotted domains covers apex/www.
function setLangCookies(code: string) {
  const host = window.location.hostname;
  const expires = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=; path=/; ${expires}`;
  document.cookie = `googtrans=; path=/; domain=${host}; ${expires}`;
  document.cookie = `googtrans=; path=/; domain=.${host}; ${expires}`;

  if (code !== "en") {
    const value = `/en/${code}`;
    document.cookie = `googtrans=${value}; path=/`;
    document.cookie = `googtrans=${value}; path=/; domain=${host}`;
    document.cookie = `googtrans=${value}; path=/; domain=.${host}`;
  }
}

export default function LanguageMenu({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile" | "floating";
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const [switching, setSwitching] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(readCurrentLang());
  }, []);

  // Drive Google Translate's own hidden <select> directly so the page
  // re-translates in place. No reload, no page hide, no white flash. The
  // trade-off is that GT briefly shows original text mid-translation; a
  // spinner in the pill button signals that a switch is in progress.
  //
  // English is the awkward case: the combo's change event to "" only works
  // when a translation is currently active AND the event bubbles. We also
  // reset selectedIndex to 0 so the change actually fires, and clear the
  // `translated-*` classes GT leaves on <html>. If none of that unwraps the
  // page within a short settle window, we fall back to a full reload since
  // that's the only 100% reliable way to restore the original DOM.
  function pickLang(code: string) {
    if (switching) return;
    setSwitching(true);
    setOpen(false);
    setLangCookies(code);

    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (!combo) {
      // Widget not ready. Reload as a last resort so the cookie takes effect.
      window.location.reload();
      return;
    }

    if (code === "en") {
      // Try to restore via the combo. Change events only fire when the value
      // actually changes, so we nudge it off the current value first.
      combo.selectedIndex = 0;
      combo.value = "";
      combo.dispatchEvent(new Event("change", { bubbles: true }));
      document.documentElement.lang = "en";
      setCurrent("en");

      // Verify restore worked. GT flips the `translated-*` class off when
      // it fully unwraps. If it's still there after 700ms, reload — that's
      // the only reliable path back to English.
      window.setTimeout(() => {
        const html = document.documentElement;
        const stillTranslated =
          html.classList.contains("translated-ltr") ||
          html.classList.contains("translated-rtl");
        if (stillTranslated) {
          window.location.reload();
        } else {
          setSwitching(false);
        }
      }, 700);
      return;
    }

    combo.value = code;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
    document.documentElement.lang = code;
    setCurrent(code);
    window.setTimeout(() => setSwitching(false), 500);
  }

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentLabel =
    LANGUAGES.find((l) => l.code === current)?.label ?? "English";

  const buttonClasses =
    variant === "desktop"
      ? "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium transition-colors hover:bg-black/5"
      : variant === "mobile"
        ? "flex items-center justify-between w-full px-3 py-3 rounded-xl text-[15px] font-medium transition-colors hover:bg-black/5"
        : "inline-flex items-center gap-1.5 pl-3 pr-3.5 py-2.5 rounded-full text-[13px] font-semibold transition-all hover:-translate-y-px";

  const rootClasses =
    variant === "floating"
      ? "fixed bottom-4 left-4 z-50"
      : "relative";

  const floatingButtonStyle =
    variant === "floating"
      ? {
          color: "var(--brand-strong)",
          backgroundColor: "var(--surface-elevated)",
          backdropFilter: "saturate(150%) blur(12px)",
          WebkitBackdropFilter: "saturate(150%) blur(12px)",
          boxShadow:
            "var(--shadow-brand), inset 0 0 0 1px var(--border-brand-soft)",
        }
      : { color: "var(--text-body)" };

  const menuPosition =
    variant === "desktop"
      ? "right-0 mt-2"
      : variant === "mobile"
        ? "left-0 right-0 mt-2"
        : "left-0 bottom-full mb-2";

  return (
    <div ref={rootRef} className={rootClasses}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={switching ? "Changing language" : "Change language"}
        translate="no"
        disabled={switching}
        className={`${buttonClasses} notranslate disabled:cursor-wait`}
        style={floatingButtonStyle}
      >
        <span className="inline-flex items-center gap-1.5">
          {switching ? (
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 animate-spin"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth={2.5} />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          )}
          <span>{switching ? "Translating…" : currentLabel}</span>
        </span>
        {!switching && (
          <svg
            viewBox="0 0 24 24"
            className="w-3 h-3 ml-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="menu"
          translate="no"
          className={`notranslate absolute ${menuPosition} w-64 rounded-2xl overflow-hidden z-[70]`}
          style={{
            backgroundColor: "var(--surface-elevated)",
            boxShadow: "var(--shadow-strong)",
          }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
              Language
            </p>
            <p className="text-[11.5px] mt-1 leading-snug" style={{ color: "var(--text-muted)" }}>
              Machine translated. May be inaccurate.
            </p>
          </div>
          <ul>
            {LANGUAGES.map((lang) => {
              const active = current === lang.code;
              return (
                <li key={lang.code}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => pickLang(lang.code)}
                    disabled={switching}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: active ? "var(--surface-accent)" : undefined,
                    }}
                    onMouseEnter={(e) => { if (!active && !switching) e.currentTarget.style.backgroundColor = "var(--overlay-hover)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = ""; }}
                  >
                    <span className="flex flex-col">
                      <span
                        className="text-[14px] font-medium"
                        style={{ color: "var(--text-heading)" }}
                      >
                        {lang.label}
                      </span>
                      <span className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>
                        {lang.note}
                      </span>
                    </span>
                    {active && (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4"
                        fill="none"
                        stroke="var(--brand)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
