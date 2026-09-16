// Currency per LEAD sector.
//
// A school reports every figure in its own money, so the code belongs on the
// report rather than on each individual amount field. Without it the district
// cannot aggregate cost savings or funds raised at all: a bare "5000" could be
// pesos, yen or baht, which differ by two orders of magnitude.

export type Currency = {
  code: string; // ISO 4217
  symbol: string;
  label: string;
};

export const CURRENCIES: readonly Currency[] = [
  { code: "HKD", symbol: "HK$", label: "Hong Kong Dollar" },
  { code: "JPY", symbol: "\u00A5", label: "Japanese Yen" },
  { code: "MYR", symbol: "RM", label: "Malaysian Ringgit" },
  { code: "MMK", symbol: "K", label: "Myanmar Kyat" },
  { code: "PHP", symbol: "\u20B1", label: "Philippine Peso" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "THB", symbol: "\u0E3F", label: "Thai Baht" },
] as const;

// Sector name (as used in src/data/schools.ts) to its default currency code.
export const SECTOR_CURRENCY: Record<string, string> = {
  "Hong Kong": "HKD",
  Japan: "JPY",
  Malaysia: "MYR",
  Myanmar: "MMK",
  Philippines: "PHP",
  Singapore: "SGD",
  Thailand: "THB",
};

export const CURRENCY_CODES: readonly string[] = CURRENCIES.map((c) => c.code);

export function isCurrencyCode(v: unknown): v is string {
  return typeof v === "string" && CURRENCY_CODES.includes(v);
}

export function currencyFor(code: string | null | undefined): Currency | null {
  if (!code) return null;
  return CURRENCIES.find((c) => c.code === code) ?? null;
}

export function symbolFor(code: string | null | undefined): string {
  return currencyFor(code)?.symbol ?? "";
}

// Default currency for a sector, used to preselect the form's picker.
export function currencyForCountry(country: string | null | undefined): string | null {
  if (!country) return null;
  return SECTOR_CURRENCY[country] ?? null;
}

// Render an amount the submitter typed as free text. The stored value is
// whatever they entered, so this only prefixes a symbol when the value looks
// like a plain number and otherwise leaves their text alone.
export function formatMoney(value: string | null | undefined, code: string | null | undefined): string {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  const symbol = symbolFor(code);
  if (!symbol) return raw;
  const n = Number(raw.replace(/[, ]/g, ""));
  if (!Number.isFinite(n)) return raw;
  return `${symbol}${n.toLocaleString()}`;
}
