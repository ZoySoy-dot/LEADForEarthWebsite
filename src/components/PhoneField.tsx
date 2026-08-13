"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

type Props = {
  label: string;
  path: string;
  value: string;
  onChange: (path: string, value: unknown) => void;
  required?: boolean;
  hint?: string;
};

// Intl.DisplayNames gives us localized full country names ("Philippines" not "PH").
const REGION_NAMES = new Intl.DisplayNames(["en"], { type: "region" });

// Convert ISO 3166-1 alpha-2 (e.g. "PH") into its regional-indicator flag emoji (🇵🇭).
// Windows chrome may render as the letter pair rather than a flag — that's a benign fallback.
function flagEmoji(cc: string): string {
  return cc
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

type CountryEntry = { code: CountryCode; name: string; calling: string };

function normalizeDigits(s: string): string {
  return s.replace(/\D+/g, "");
}

// Split a stored E.164 string back into (country, national) so the UI can reflect
// a restored draft. Falls back gracefully if the number is partial/invalid.
function decompose(stored: string): { country: CountryCode | ""; national: string } {
  if (!stored) return { country: "", national: "" };
  const parsed = parsePhoneNumberFromString(stored);
  if (parsed?.country) {
    return { country: parsed.country, national: parsed.formatNational() };
  }
  return { country: "", national: stored };
}

export default function PhoneField({ label, path, value, onChange, required, hint }: Props) {
  const countries = useMemo<CountryEntry[]>(() => {
    return getCountries()
      .map((code) => ({
        code,
        name: REGION_NAMES.of(code) ?? code,
        calling: getCountryCallingCode(code),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const initial = decompose(value);
  const [country, setCountry] = useState<CountryCode | "">(initial.country);
  const [national, setNational] = useState(initial.national);
  // Track our last emit so reducer-driven re-renders don't stomp local input.
  const lastEmittedRef = useRef(value);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value === lastEmittedRef.current) return;
    const next = decompose(value);
    setCountry(next.country);
    setNational(next.national);
    lastEmittedRef.current = value;
  }, [value]);

  // Close the country popover on outside click or Escape.
  useEffect(() => {
    if (!isOpen) return;
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    // Focus the search box shortly after open so keyboard users land there.
    const t = setTimeout(() => searchRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [isOpen]);

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.calling.includes(q.replace(/^\+/, "")) ||
        c.code.toLowerCase().includes(q),
    );
  }, [countries, search]);

  function emit(nextCountry: CountryCode | "", formattedNational: string) {
    if (!nextCountry || !formattedNational.trim()) {
      lastEmittedRef.current = "";
      onChange(path, "");
      return;
    }
    const digits = normalizeDigits(formattedNational);
    const parsed = parsePhoneNumberFromString(digits, nextCountry);
    const out = parsed?.number ?? `+${getCountryCallingCode(nextCountry)}${digits}`;
    lastEmittedRef.current = out;
    onChange(path, out);
  }

  function selectCountry(next: CountryCode | "") {
    setCountry(next);
    setIsOpen(false);
    setSearch("");
    if (!next) {
      setNational("");
      lastEmittedRef.current = "";
      onChange(path, "");
      return;
    }
    const digits = normalizeDigits(national);
    const formatter = new AsYouType(next);
    const reformatted = formatter.input(digits);
    setNational(reformatted);
    emit(next, reformatted);
  }

  function handleNationalChange(raw: string) {
    const trimmed = raw.trimStart();

    // Leading "+" → international mode: detect country as digits stream in.
    if (trimmed.startsWith("+")) {
      const formatter = new AsYouType();
      const formatted = formatter.input(trimmed);
      const detected = formatter.getCountry();
      if (detected) setCountry(detected);
      setNational(formatted);
      const parsed = parsePhoneNumberFromString(trimmed);
      if (parsed?.isValid()) {
        lastEmittedRef.current = parsed.number;
        onChange(path, parsed.number);
      } else {
        lastEmittedRef.current = "";
        onChange(path, "");
      }
      return;
    }

    if (!country) {
      // No country picked and no leading "+": hold onto digits, don't format.
      const digits = normalizeDigits(raw);
      setNational(digits);
      lastEmittedRef.current = "";
      onChange(path, "");
      return;
    }

    // Reset formatter per keystroke, feed only the digits, take formatter output.
    const digits = normalizeDigits(raw);
    const formatter = new AsYouType(country);
    const formatted = formatter.input(digits);
    setNational(formatted);
    emit(country, formatted);
  }

  const inputId = `phone-${path.replace(/\./g, "-")}`;

  return (
    <div ref={rootRef}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex gap-2 relative">
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={country ? `Country: ${REGION_NAMES.of(country)}` : "Select country"}
          className="shrink-0 inline-flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-4 text-base bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        >
          {country ? (
            <span className="text-xl leading-none" aria-hidden="true">
              {flagEmoji(country)}
            </span>
          ) : (
            <span className="text-xl leading-none" aria-hidden="true">🌐</span>
          )}
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div className="flex-1 min-w-0 flex items-center border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-green-400 transition">
          {country && (
            <span
              onMouseDown={(e) => {
                // Clicking the prefix moves focus into the input rather than
                // stealing selection to a non-editable span.
                e.preventDefault();
                document.getElementById(inputId)?.focus();
              }}
              className="pl-5 pr-1 text-base text-gray-500 select-none shrink-0 cursor-text tabular-nums"
              aria-hidden="true"
            >
              +{getCountryCallingCode(country)}
            </span>
          )}
          <input
            id={inputId}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={national}
            onChange={(e) => handleNationalChange(e.target.value)}
            placeholder={country ? "Phone number" : "Pick a country, or paste with +country code"}
            required={required}
            className={`flex-1 min-w-0 bg-transparent py-4 text-base focus:outline-none ${country ? "pl-2 pr-5" : "px-5"}`}
          />
        </div>

        {isOpen && (
          <div
            className="absolute top-full left-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden"
            style={{ boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15), 0 4px 8px -4px rgba(0,0,0,0.08)" }}
            role="listbox"
          >
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <ul className="overflow-y-auto max-h-72">
              {filteredCountries.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-500">No matches</li>
              )}
              {filteredCountries.map((c) => {
                const active = c.code === country;
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => selectCountry(c.code)}
                      role="option"
                      aria-selected={active}
                      className={`w-full text-left px-3 py-2.5 flex items-center gap-3 text-sm hover:bg-green-50 transition-colors ${
                        active ? "bg-green-50" : ""
                      }`}
                    >
                      <span className="text-lg leading-none shrink-0" aria-hidden="true">
                        {flagEmoji(c.code)}
                      </span>
                      <span className="flex-1 min-w-0 truncate text-gray-800">{c.name}</span>
                      <span className="text-gray-500 tabular-nums shrink-0">+{c.calling}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
