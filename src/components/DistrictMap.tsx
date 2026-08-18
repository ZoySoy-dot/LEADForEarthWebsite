"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BBox, MapData } from "@/lib/districtMapData";

type SchoolEntry = { name: string; reports: number; participants: number };

type Props = {
  mapData: MapData;
  schoolsByCountry: Record<string, SchoolEntry[]>;
};

const MIN_SCALE = 1;
const MAX_SCALE = 30;
const FOCUS_FIT = 0.85; // country fills ~85% of the visible (non-panel) area when focused

// Palette — every UI color routes through a token so [data-theme="dark"] can
// flip the ocean/land treatment while keeping the LEAD greens on-brand.
const SEA = "var(--map-sea)";
const LAND = "var(--map-context-land)";
const LAND_BORDER = "var(--map-context-land-border)";
const LEAD = "var(--brand-mid)";
const LEAD_HOVER = "var(--brand-light)";
const LEAD_ACTIVE = "var(--brand)";
const LEAD_BORDER = "var(--surface)";
const LABEL_TEXT = "var(--surface)";
const LABEL_HALO = "var(--map-label-halo)";

export default function DistrictMap({ mapData, schoolsByCountry }: Props) {
  const { width, height, countries, labels, pins, places, schools } = mapData;
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [focused, setFocused] = useState<string | null>(null);
  // Transform lives in viewBox units and is applied to an inner <g>, so SVG
  // re-rasterises vectors on every scale change (no bitmap pixelation).
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [animate, setAnimate] = useState(true);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [placesReady, setPlacesReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef(transform);
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  // Track container size for HTML-overlay place labels (need to convert
  // viewBox coords to CSS pixels).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setContainerSize({ w: rect.width, h: rect.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fade in place labels only after the zoom animation settles. Both branches
  // schedule via timeouts to avoid a synchronous setState in the effect body.
  useEffect(() => {
    if (!focused) {
      const t = setTimeout(() => setPlacesReady(false), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPlacesReady(true), 520);
    return () => clearTimeout(t);
  }, [focused]);

  // ---- Touch pinch/pan gestures (mobile) --------------------------------
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let mode: "idle" | "pinch" | "pan" = "idle";
    let startDist = 0;
    let startPan = { x: 0, y: 0 };
    let startTransform = { scale: 1, x: 0, y: 0 };
    let startSf = 1;

    const dist = (t1: Touch, t2: Touch) =>
      Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

    const captureSf = () => {
      const rect = el.getBoundingClientRect();
      return Math.min(rect.width / width, rect.height / height);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        mode = "pinch";
        setAnimate(false);
        startDist = dist(e.touches[0], e.touches[1]);
        startTransform = { ...transformRef.current };
        startSf = captureSf();
        e.preventDefault();
      } else if (e.touches.length === 1 && transformRef.current.scale > 1.02) {
        // Prime a potential pan but DO NOT preventDefault yet; that would
        // suppress the follow-up click event and break buttons/taps.
        mode = "pan";
        setAnimate(false);
        startPan = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        startTransform = { ...transformRef.current };
        startSf = captureSf();
      } else {
        mode = "idle";
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (mode === "pinch" && e.touches.length === 2) {
        e.preventDefault();
        const d = dist(e.touches[0], e.touches[1]);
        const ratio = d / startDist;
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, startTransform.scale * ratio));
        // Anchor pinch to the viewBox center so content doesn't shift while scaling.
        const ax = width / 2;
        const ay = height / 2;
        const tx = startTransform.x + ax * (startTransform.scale - newScale);
        const ty = startTransform.y + ay * (startTransform.scale - newScale);
        setTransform({ scale: newScale, x: tx, y: ty });
      } else if (mode === "pan" && e.touches.length === 1) {
        e.preventDefault();
        const dx = e.touches[0].clientX - startPan.x;
        const dy = e.touches[0].clientY - startPan.y;
        setTransform({
          ...startTransform,
          x: startTransform.x + dx / startSf,
          y: startTransform.y + dy / startSf,
        });
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) mode = "idle";
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    el.addEventListener("touchcancel", onTouchEnd, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [width, height]);

  // ---- Zoom to country --------------------------------------------------
  const focusCountry = (country: string, bbox: BBox | null) => {
    if (!bbox) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const W = rect.width;
    const H = rect.height;
    // viewBox <-> CSS-px scale factor (preserveAspectRatio="xMidYMid meet")
    const sf = Math.min(W / width, H / height);
    // Reserve space for the schools panel so the country isn't hidden underneath it.
    const isDesktop = W >= 640;
    const panelWCss = isDesktop ? 360 : 0;
    const panelHCss = !isDesktop ? H * 0.55 : 0;
    const usableW = W - panelWCss;
    const usableH = H - panelHCss;

    const cx = (bbox[0][0] + bbox[1][0]) / 2;
    const cy = (bbox[0][1] + bbox[1][1]) / 2;
    const bw = Math.max(bbox[1][0] - bbox[0][0], 20);
    const bh = Math.max(bbox[1][1] - bbox[0][1], 20);

    // Solve for zoom so the country's rendered size (bw*sf*S x bh*sf*S)
    // fills FOCUS_FIT of the usable (non-panel) area.
    const S = Math.min(
      MAX_SCALE,
      Math.min(usableW / (bw * sf), usableH / (bh * sf)) * FOCUS_FIT
    );

    // Where in viewBox coords should the country's centre land?
    // Non-panel centre in CSS px:
    const targetCssX = (W - panelWCss) / 2;
    const targetCssY = (H - panelHCss) / 2;
    // Convert to viewBox coords (undo meet centring + scale).
    const offX = (W - width * sf) / 2;
    const offY = (H - height * sf) / 2;
    const targetVbX = (targetCssX - offX) / sf;
    const targetVbY = (targetCssY - offY) / sf;

    // Inner <g> transform (transform-origin 0 0):
    //   point P renders at (S*P + t) in viewBox coords
    //   set country centre -> target  =>  t = target - S * centre
    const tx = targetVbX - S * cx;
    const ty = targetVbY - S * cy;

    setAnimate(true);
    setHovered(null);
    setFocused(country);
    setTransform({ scale: S, x: tx, y: ty });
  };

  const resetView = () => {
    setAnimate(true);
    setFocused(null);
    setTransform({ scale: 1, x: 0, y: 0 });
  };

  // ---- Hover tooltip ----------------------------------------------------
  const trackPointer = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const totalReports = (country: string) =>
    (schoolsByCountry[country] ?? []).reduce((s, i) => s + i.reports, 0);

  const hoveredCount = hovered ? totalReports(hovered) : 0;
  const above = tooltipPos.y > 70;
  const showTooltip = hovered !== null && focused === null;

  // Countries visible in the map layer. When zoomed in, only the focused
  // country renders; everything else is hidden.
  const leadCountries = countries.filter((c) => c.leadCountry !== null);
  const contextCountries = countries.filter((c) => c.leadCountry === null);

  const gStyle: React.CSSProperties = {
    transformOrigin: "0 0",
    transformBox: "view-box",
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
    transition: animate ? "transform 520ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
  };

  // HTML-overlay place labels: computed in CSS px so they stay crisp at any
  // zoom. Only shown for the focused country.
  const focusedPlaces = useMemo(() => {
    if (!focused) return [];
    const { w: W, h: H } = containerSize;
    if (W === 0 || H === 0) return [];
    const sf = Math.min(W / width, H / height);
    const offX = (W - width * sf) / 2;
    const offY = (H - height * sf) / 2;
    return places
      .filter((p) => p.country === focused)
      .map((p) => {
        const vbX = transform.scale * p.x + transform.x;
        const vbY = transform.scale * p.y + transform.y;
        return {
          name: p.name,
          kind: p.kind,
          labelPos: p.labelPos ?? "right",
          cssX: offX + vbX * sf,
          cssY: offY + vbY * sf,
        };
      });
  }, [focused, transform, places, containerSize, width, height]);

  // Same projection as focusedPlaces but for LEAD schools; stars stay pixel-
  // sized regardless of zoom, matching the place-dot approach.
  const focusedSchools = useMemo(() => {
    if (!focused) return [];
    const { w: W, h: H } = containerSize;
    if (W === 0 || H === 0) return [];
    const sf = Math.min(W / width, H / height);
    const offX = (W - width * sf) / 2;
    const offY = (H - height * sf) / 2;
    return schools
      .filter((s) => s.country === focused)
      .map((s) => {
        const vbX = transform.scale * s.x + transform.x;
        const vbY = transform.scale * s.y + transform.y;
        return {
          name: s.name,
          location: s.location,
          cssX: offX + vbX * sf,
          cssY: offY + vbY * sf,
        };
      });
  }, [focused, transform, schools, containerSize, width, height]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[440px] overflow-hidden"
      style={{ touchAction: "pan-y", backgroundColor: "var(--map-sea)" }}
      onMouseMove={trackPointer}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full h-full"
        role="img"
        aria-label="Map of the Lasallian East Asia District covering Japan, Hong Kong, Myanmar, Thailand, Philippines, Malaysia, and Singapore. Click a highlighted country to see its schools."
      >
        <defs>
          <filter id="lead-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" />
            <feOffset dy="1.2" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.28" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g style={gStyle}>
          {/* Context (non-LEAD) countries; hidden when focused */}
          {!focused &&
            contextCountries.map((c) => (
              <path
                key={c.id}
                d={c.d}
                strokeWidth={0.6}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{ fill: LAND, stroke: LAND_BORDER }}
              />
            ))}

          {/* LEAD countries; only the focused one when focused */}
          <g filter="url(#lead-shadow)">
            {leadCountries.map((c) => {
              if (focused && c.leadCountry !== focused) return null;
              const isHovered = c.leadCountry === hovered;
              const isFocused = c.leadCountry === focused;
              const fill = isFocused ? LEAD_ACTIVE : isHovered ? LEAD_HOVER : LEAD;
              return (
                <path
                  key={c.id}
                  d={c.d}
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    fill,
                    stroke: LEAD_BORDER,
                    cursor: focused ? "default" : "pointer",
                    transition: "fill 180ms",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!focused && c.leadCountry && c.bbox) focusCountry(c.leadCountry, c.bbox);
                  }}
                  onMouseEnter={() => !focused && c.leadCountry && setHovered(c.leadCountry)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={`${c.leadCountry}, ${totalReports(c.leadCountry ?? "")} reports`}
                />
              );
            })}
          </g>

          {/* Pins & labels; hidden when zoomed in */}
          {!focused && (
            <>
              {pins.map((p) => {
                const isHovered = p.country === hovered;
                const fill = isHovered ? LEAD_HOVER : LEAD;
                const country = countries.find((c) => c.leadCountry === p.country);
                return (
                  <g key={`pin-${p.country}`}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={18}
                      fill={fill}
                      fillOpacity={0.18}
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 11 : 9}
                      fill={fill}
                      stroke={SEA}
                      strokeWidth={2.5}
                      style={{ cursor: "pointer", transition: "r 180ms, fill 180ms" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (country?.bbox) focusCountry(p.country, country.bbox);
                      }}
                      onMouseEnter={() => setHovered(p.country)}
                      onMouseLeave={() => setHovered(null)}
                      aria-label={`${p.country}, ${totalReports(p.country)} reports`}
                    />
                    <circle cx={p.x} cy={p.y} r={2.5} style={{ fill: "var(--surface)" }} pointerEvents="none" />
                  </g>
                );
              })}

              {labels.map((l) => {
                const country = countries.find((c) => c.leadCountry === l.country);
                return (
                  <text
                    key={`label-${l.country}`}
                    x={l.x + l.dx}
                    y={l.y + l.dy}
                    fontSize={20}
                    fontWeight={700}
                    letterSpacing="0.02em"
                    fill={LABEL_TEXT}
                    textAnchor={l.anchor}
                    paintOrder="stroke"
                    stroke={LABEL_HALO}
                    strokeWidth={4.5}
                    strokeLinejoin="round"
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (country?.bbox) focusCountry(l.country, country.bbox);
                    }}
                    onMouseEnter={() => setHovered(l.country)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {l.country}
                  </text>
                );
              })}
            </>
          )}
        </g>
      </svg>

      {/* Place labels overlay (only when focused) --------------------------
          Each place is a zero-size anchor at the exact projected coord; the
          dot marker is centred on the anchor, and the text sits on whichever
          side `labelPos` specifies (default right). */}
      {focused &&
        focusedPlaces.map((p) => {
          const isCapital = p.kind === "capital";
          const dotSize = isCapital ? 8 : 6;
          const half = dotSize / 2;
          const gap = 6;
          const labelStyle: React.CSSProperties = {
            fontSize: isCapital ? 12 : 11,
            fontWeight: isCapital ? 700 : 600,
            color: "var(--text-heading)",
            padding: "1px 6px",
            borderRadius: 4,
            backgroundColor: "var(--header-bg-scrolled)",
            boxShadow: "var(--shadow-soft)",
            letterSpacing: "0.01em",
          };
          switch (p.labelPos) {
            case "left":
              labelStyle.right = half + gap;
              labelStyle.top = -9;
              break;
            case "top":
              labelStyle.left = 0;
              labelStyle.bottom = half + gap;
              labelStyle.transform = "translateX(-50%)";
              break;
            case "bottom":
              labelStyle.left = 0;
              labelStyle.top = half + gap;
              labelStyle.transform = "translateX(-50%)";
              break;
            case "right":
            default:
              labelStyle.left = half + gap;
              labelStyle.top = -9;
              break;
          }
          return (
            <div
              key={`place-${p.name}`}
              className="absolute pointer-events-none"
              style={{
                left: p.cssX,
                top: p.cssY,
                width: 0,
                height: 0,
                opacity: placesReady ? 1 : 0,
                transition: "opacity 260ms ease-out",
              }}
            >
              <span
                className="block absolute rounded-full"
                style={{
                  top: -half,
                  left: -half,
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: "var(--surface)",
                  border: `${isCapital ? 2 : 1.5}px solid var(--text-heading)`,
                }}
              />
              <span className="absolute whitespace-nowrap" style={labelStyle}>
                {p.name}
              </span>
            </div>
          );
        })}

      {/* LEAD school stars (only when focused). Star markers pinned at each
          member school's coordinates in the focused country. */}
      {focused &&
        focusedSchools.map((s) => (
          <div
            key={`school-${s.name}`}
            className="absolute"
            style={{
              left: s.cssX,
              top: s.cssY,
              width: 0,
              height: 0,
              opacity: placesReady ? 1 : 0,
              transition: "opacity 260ms ease-out",
            }}
          >
            <span
              className="absolute block"
              style={{
                left: -8,
                top: -8,
                width: 16,
                height: 16,
                pointerEvents: "auto",
                cursor: "help",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
              }}
              title={`${s.name} — ${s.location}`}
              aria-label={s.name}
            >
              <svg viewBox="-1 -1 2 2" className="w-full h-full">
                <path
                  d="M 0,-1 L 0.225,-0.309 L 0.951,-0.309 L 0.363,0.118 L 0.588,0.809 L 0,0.382 L -0.588,0.809 L -0.363,0.118 L -0.951,-0.309 L -0.225,-0.309 Z"
                  style={{ fill: "var(--brand-strong)", stroke: "var(--surface)" }}
                  strokeWidth={0.16}
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        ))}

      {/* Hover tooltip -----------------------------------------------------*/}
      {showTooltip && (
        <div
          className="absolute pointer-events-none rounded-xl px-4 py-2.5 z-10"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: above
              ? "translate(-50%, calc(-100% - 14px))"
              : "translate(-50%, 14px)",
            backgroundColor: "var(--surface)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.15em] whitespace-nowrap"
            style={{ color: "var(--brand-mid)" }}
          >
            {hovered}
          </p>
          <p className="text-lg font-bold leading-tight tracking-tight mt-0.5" style={{ color: "var(--text-heading)" }}>
            {hoveredCount.toLocaleString()}{" "}
            <span className="text-[11px] font-medium uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>
              {hoveredCount === 1 ? "report" : "reports"}
            </span>
          </p>
        </div>
      )}

      {/* Focused country panel --------------------------------------------*/}
      {focused && (
        <CountryPanel
          country={focused}
          schools={schoolsByCountry[focused] ?? []}
          onClose={resetView}
        />
      )}
    </div>
  );
}

function CountryPanel({
  country,
  schools,
  onClose,
}: {
  country: string;
  schools: SchoolEntry[];
  onClose: () => void;
}) {
  const totalReports = schools.reduce((s, i) => s + i.reports, 0);
  const totalParticipants = schools.reduce((s, i) => s + i.participants, 0);

  return (
    <div
      className="absolute inset-x-0 bottom-0 top-1/2 sm:top-0 sm:bottom-0 sm:right-0 sm:inset-x-auto sm:w-[360px] backdrop-blur-md flex flex-col z-20"
      style={{
        backgroundColor: "var(--header-bg-scrolled)",
        boxShadow: "var(--shadow-strong)",
      }}
    >
      <div className="flex items-start justify-between gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="min-w-0">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--brand-mid)" }}>
            Sector
          </p>
          <h2 className="text-xl font-bold tracking-tight mt-0.5" style={{ color: "var(--text-heading)" }}>
            {country}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-none w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ color: "var(--text-subtle)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--overlay-hover)"; e.currentTarget.style.color = "var(--text-body)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-subtle)"; }}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <Stat label="Schools" value={schools.length.toLocaleString()} />
        <Stat label="Reports" value={totalReports.toLocaleString()} />
        {totalParticipants > 0 && (
          <div className="col-span-2">
            <Stat label="People reached" value={totalParticipants.toLocaleString()} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {schools.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              No reports yet from {country}.
              <br />
              Schools contributing to #LEADforEarth will appear here.
            </p>
          </div>
        ) : (
          <ul>
            {schools.map((s) => (
              <li key={s.name} className="px-5 py-3.5 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13.5px] leading-snug" style={{ color: "var(--text-heading)" }}>
                    {s.name}
                  </p>
                  {s.participants > 0 && (
                    <p className="text-[11.5px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {s.participants.toLocaleString()} people reached
                    </p>
                  )}
                </div>
                <div className="flex-none text-right">
                  <p className="text-lg font-bold leading-none tracking-tight" style={{ color: "var(--text-heading)" }}>
                    {s.reports.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] mt-1" style={{ color: "var(--text-subtle)" }}>
                    {s.reports === 1 ? "report" : "reports"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mx-5 mb-5 mt-3 py-2.5 rounded-full text-[12.5px] font-semibold transition-colors"
        style={{ backgroundColor: "var(--brand)", color: "var(--text-inverse)" }}
      >
        Back to map
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="text-lg font-bold tracking-tight mt-1" style={{ color: "var(--text-heading)" }}>
        {value}
      </p>
    </div>
  );
}
