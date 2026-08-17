"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LEAD_SCHOOLS } from "@/data/schools";

const MAX_RESULTS = 10;
const INPUT_CLS =
  "w-full border border-[color:var(--border-input)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-[color:var(--border-input-focus)] transition";
const LABEL_CLS = "block text-sm font-medium mb-1.5";

// API matches <Field /> so this can be swapped in/out with a one-line change.
type Props = {
  label: string;
  path: string;
  value: string;
  onChange: (path: string, v: string) => void;
  required?: boolean;
  placeholder?: string;
  hint?: string;
};

export default function SchoolAutocomplete({
  label,
  path,
  value,
  onChange,
  required,
  placeholder,
  hint,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    const scored = LEAD_SCHOOLS.map((s) => {
      const name = s.name.toLowerCase();
      const country = s.country.toLowerCase();
      let score = -1;
      if (name.startsWith(q)) score = 0;
      else if (name.includes(q)) score = 1;
      else if (country.includes(q)) score = 2;
      return { s, score };
    })
      .filter((x) => x.score >= 0)
      .sort((a, b) => a.score - b.score || a.s.name.localeCompare(b.s.name))
      .slice(0, MAX_RESULTS)
      .map((x) => x.s);
    return scored;
  }, [value]);

  // Clamp during render, avoids the "setState in effect" cascade when matches shrink.
  const safeIdx = matches.length === 0 ? 0 : Math.min(activeIdx, matches.length - 1);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isExactMatch = LEAD_SCHOOLS.some((s) => s.name === value);
  const showDropdown = open && matches.length > 0 && !isExactMatch;

  function pick(name: string) {
    onChange(path, name);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = matches[safeIdx];
      if (picked) pick(picked.name);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label className={LABEL_CLS} style={{ color: "var(--text-body)" }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(path, e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className={INPUT_CLS}
        style={{ backgroundColor: "var(--surface)", color: "var(--text-primary)" }}
      />
      {hint && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{hint}</p>}

      {showDropdown && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full rounded-xl shadow-lg overflow-hidden max-h-80 overflow-y-auto border"
          style={{ backgroundColor: "var(--surface-elevated)", borderColor: "var(--border-input)" }}
        >
          {matches.map((s, i) => (
            <li key={`${s.country}:${s.name}`}>
              <button
                type="button"
                role="option"
                aria-selected={safeIdx === i}
                onClick={() => pick(s.name)}
                onMouseEnter={() => setActiveIdx(i)}
                className="w-full text-left px-4 py-2.5 text-sm flex justify-between items-center gap-3 transition-colors"
                style={{
                  backgroundColor: safeIdx === i ? "var(--overlay-brand-hover)" : "var(--surface-elevated)",
                }}
              >
                <span style={{ color: "var(--text-primary)" }}>{s.name}</span>
                <span className="text-xs shrink-0" style={{ color: "var(--text-subtle)" }}>{s.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
