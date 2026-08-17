"use client";

import { useState } from "react";
import Image from "next/image";
import type { GlobeData } from "@/lib/districtGlobeData";

const COUNTRY_FLAG_CODE: Record<string, string> = {
  Japan: "jp",
  "Hong Kong": "hk",
  Malaysia: "my",
  Myanmar: "mm",
  Philippines: "ph",
  Singapore: "sg",
  Thailand: "th",
};

// Palette aligned to the Lasallian brand tokens in globals.css. All routed
// through CSS vars so [data-theme="dark"] can flip the ocean/land treatment
// while keeping the LEAD greens on-brand.
const OCEAN = "var(--brand-pale)"; // green-pale, reads as Lasallian rather than a generic atlas
const LAND = "var(--map-land)"; // warm cream so LEAD greens pop without competing with the ocean
const LAND_BORDER = "var(--map-land-border)";
const LEAD = "var(--brand-mid)"; // green-mid
const LEAD_HOVER = "var(--brand-light)"; // green-light
const LEAD_ACTIVE = "var(--brand)"; // green-dark
const LEAD_BORDER = "var(--surface)";
const LEAD_SELECTED_GLOW = "#0d3d1a"; // static seed color for feFlood (SVG filters resolve CSS vars unreliably)
const GRATICULE = "var(--map-graticule)";
const SPHERE_BORDER = "var(--brand)";
const STAR_FILL = "var(--surface)";
const STAR_STROKE = "var(--text-heading)";

// 5-point star (Signum Fidei) centered at origin, outer radius 1, inner ~0.382.
const STAR_PATH =
  "M 0,-1 L 0.225,-0.309 L 0.951,-0.309 L 0.363,0.118 L 0.588,0.809 L 0,0.382 L -0.588,0.809 L -0.363,0.118 L -0.951,-0.309 L -0.225,-0.309 Z";

type Props = {
  globeData: GlobeData;
  selected: string | null;
  onSelect: (country: string | null) => void;
};

export default function DistrictGlobe({ globeData, selected, onSelect }: Props) {
  const { size, countries, graticuleD, stars } = globeData;
  const [hovered, setHovered] = useState<string | null>(null);

  const leadCountries = countries.filter((c) => c.leadCountry !== null);
  const contextCountries = countries.filter((c) => c.leadCountry === null);

  const toggle = (country: string) => {
    onSelect(selected === country ? null : country);
  };

  const legendCountries = [...stars].sort((a, b) =>
    a.country.localeCompare(b.country)
  );

  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full h-[400px] sm:h-[520px] overflow-hidden">
      {/* Crop the projection to SE Asia so LEAD sectors take up ~2x the area,
          making Singapore/Hong Kong easier to hit. Values are in the base
          projection's viewBox coords (size=520). */}
      <svg
        viewBox={`${size * 0.27} ${size * 0.19} ${size * 0.5} ${size * 0.5}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Globe of the Lasallian East Asia District. Click a highlighted country to filter the list below."
      >
        <defs>
          <filter id="selected-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" />
            <feFlood floodColor={LEAD_SELECTED_GLOW} floodOpacity="0.55" />
            <feComposite in2="SourceAlpha" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={size / 2} cy={size / 2} r={size / 2 - 6} style={{ fill: OCEAN }} />

        <path
          d={graticuleD}
          fill="none"
          style={{ stroke: GRATICULE }}
          strokeWidth={0.5}
          opacity={0.55}
        />

        {contextCountries.map((c) => (
          <path
            key={c.id}
            d={c.d}
            style={{ fill: LAND, stroke: LAND_BORDER }}
            strokeWidth={0.5}
          />
        ))}

        {leadCountries.map((c) => {
          const country = c.leadCountry as string;
          const isHovered = country === hovered;
          const isSelected = country === selected;
          const fill = isSelected ? LEAD_ACTIVE : isHovered ? LEAD_HOVER : LEAD;
          const strokeWidth = isSelected ? 1.8 : isHovered ? 1.4 : 0.8;
          return (
            <path
              key={c.id}
              d={c.d}
              strokeWidth={strokeWidth}
              filter={isSelected ? "url(#selected-glow)" : undefined}
              style={{
                fill,
                stroke: LEAD_BORDER,
                cursor: "pointer",
                transition: "fill 180ms, stroke-width 180ms",
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggle(country);
              }}
              onMouseEnter={() => setHovered(country)}
              onMouseLeave={() => setHovered(null)}
              aria-label={country}
              aria-pressed={isSelected}
            />
          );
        })}

        {stars.map((s) => {
          const isSelected = s.country === selected;
          const isHovered = s.country === hovered;
          const scale = isSelected ? 4.5 : isHovered ? 4 : 3.5;
          return (
            <g
              key={`star-${s.country}`}
              transform={`translate(${s.x} ${s.y})`}
              onClick={(e) => {
                e.stopPropagation();
                toggle(s.country);
              }}
              onMouseEnter={() => setHovered(s.country)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
              aria-label={`${s.country} marker`}
            >
              {/* Invisible circle enlarges the hit area beyond the star
                  itself; helpful for Singapore/Hong Kong. */}
              <circle r={8} fill="transparent" />
              <path
                d={STAR_PATH}
                transform={`scale(${scale})`}
                strokeWidth={0.18}
                strokeLinejoin="round"
                style={{
                  fill: STAR_FILL,
                  stroke: STAR_STROKE,
                  pointerEvents: "none",
                  transition: "transform 180ms",
                }}
              />
            </g>
          );
        })}

        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 6}
          fill="none"
          style={{ stroke: SPHERE_BORDER }}
          strokeWidth={1}
          opacity={0.55}
        />
      </svg>

      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-sm"
        style={{
          backgroundColor: "var(--header-bg-scrolled)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {selected ? (
          <>
            {COUNTRY_FLAG_CODE[selected] && (
              <Image
                src={`https://flagcdn.com/w40/${COUNTRY_FLAG_CODE[selected]}.png`}
                alt=""
                width={20}
                height={15}
                className="rounded-sm"
                style={{
                  objectFit: "cover",
                  boxShadow: "0 0 0 1px var(--border-subtle)",
                }}
              />
            )}
            <span
              className="text-[11.5px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--brand)" }}
            >
              {selected}
            </span>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="ml-1 -mr-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
              style={{ color: "var(--text-subtle)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--overlay-hover)";
                e.currentTarget.style.color = "var(--text-body)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
                e.currentTarget.style.color = "var(--text-subtle)";
              }}
              aria-label="Clear country filter"
            >
              <svg
                viewBox="0 0 24 24"
                width={11}
                height={11}
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: LEAD }}
            />
            <span
              className="text-[11.5px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--brand)" }}
            >
              Tap a country to filter
            </span>
          </>
        )}
      </div>
      </div>

      <div className="mt-3 px-2 flex flex-wrap justify-center gap-1.5">
        {legendCountries.map((s) => {
          const isSelected = s.country === selected;
          const isHovered = s.country === hovered;
          return (
            <button
              key={`legend-${s.country}`}
              type="button"
              onClick={() => toggle(s.country)}
              onMouseEnter={() => setHovered(s.country)}
              onMouseLeave={() => setHovered(null)}
              className="inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border transition-colors"
              style={{
                backgroundColor: isSelected
                  ? "var(--brand)"
                  : isHovered
                    ? "var(--surface-accent)"
                    : "var(--surface)",
                borderColor: isSelected ? "var(--brand)" : "var(--border-input)",
                color: isSelected ? "var(--text-inverse)" : "var(--text-heading)",
              }}
              aria-pressed={isSelected}
            >
              {COUNTRY_FLAG_CODE[s.country] && (
                <Image
                  src={`https://flagcdn.com/w40/${COUNTRY_FLAG_CODE[s.country]}.png`}
                  alt=""
                  width={18}
                  height={13}
                  className="rounded-sm"
                  style={{
                    objectFit: "cover",
                    boxShadow: "0 0 0 1px var(--border-subtle)",
                  }}
                />
              )}
              <span className="text-[11.5px] font-semibold tracking-tight">
                {s.country}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
