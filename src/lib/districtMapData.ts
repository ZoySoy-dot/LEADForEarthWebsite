import "server-only";

import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import topology from "world-atlas/countries-50m.json";
import { PLACES_BY_COUNTRY, type LabelPos, type PlaceKind } from "@/data/places";

type CountryProps = { name: string };

// LEAD-member country name -> ISO 3166-1 numeric id (as string, matching world-atlas ids)
export const LEAD_COUNTRY_IDS: Record<string, string> = {
  Japan: "392",
  Myanmar: "104",
  Thailand: "764",
  Philippines: "608",
  Malaysia: "458",
  Singapore: "702",
  "Hong Kong": "344",
};
const ID_TO_LEAD_COUNTRY = Object.fromEntries(
  Object.entries(LEAD_COUNTRY_IDS).map(([name, id]) => [id, name])
) as Record<string, string>;

// Emphasis pins so the two smallest sectors read at any zoom
const PIN_IDS = new Set(["344", "702"]);

// Label anchor overrides (default is middle, centered on country label point)
const LABEL_META: Record<string, { lng: number; lat: number; anchor?: "start" | "end" | "middle"; dx?: number; dy?: number }> = {
  Japan:        { lng: 138.0, lat: 36.5 },
  Myanmar:      { lng: 96.0,  lat: 21.0 },
  Thailand:     { lng: 100.5, lat: 15.5 },
  Philippines:  { lng: 122.5, lat: 12.5 },
  Malaysia:     { lng: 113.0, lat: 3.0 },
  Singapore:    { lng: 103.8, lat: 1.35, anchor: "end", dx: -14 },
  "Hong Kong":  { lng: 114.2, lat: 22.3, anchor: "start", dx: 16 },
};

// MultiPoint (not Polygon) so d3-geo builds a rectangular bbox rather than
// invoking spherical winding-order logic.
const BOUNDS: Feature = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "MultiPoint",
    coordinates: [
      [62, -12],
      [158, -12],
      [158, 48],
      [62, 48],
    ],
  },
};

export type BBox = [[number, number], [number, number]];

export type MapCountry = {
  id: string;
  name: string;
  d: string;
  leadCountry: string | null;
  // Projected bbox in viewBox coords - present for LEAD countries only.
  // Used for zoom-to-country.
  bbox: BBox | null;
};

export type MapLabel = {
  country: string;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  dx: number;
  dy: number;
};

export type MapPin = { country: string; x: number; y: number };

export type MapPlace = {
  country: string;
  name: string;
  x: number;
  y: number;
  kind?: PlaceKind;
  labelPos?: LabelPos;
};

export type MapData = {
  width: number;
  height: number;
  countries: MapCountry[];
  labels: MapLabel[];
  pins: MapPin[];
  places: MapPlace[];
};

export function buildDistrictMapData(): MapData {
  const width = 1800;
  const height = 900;

  const topo = topology as unknown as Topology;
  const countries = topo.objects.countries as GeometryCollection;
  const world = feature(topo, countries) as unknown as FeatureCollection<Geometry, CountryProps>;

  const projection = geoMercator().fitSize([width, height], BOUNDS);
  const pathFn = geoPath(projection);
  const project = (lng: number, lat: number): [number, number] =>
    projection([lng, lat]) ?? [0, 0];

  const mapCountries: MapCountry[] = world.features
    .map((f) => {
      const id = String(f.id);
      const d = pathFn(f) ?? "";
      const leadCountry = ID_TO_LEAD_COUNTRY[id] ?? null;
      const bbox = leadCountry ? (pathFn.bounds(f) as BBox) : null;
      return {
        id,
        name: f.properties?.name ?? "",
        d,
        leadCountry,
        bbox,
      };
    })
    .filter((c) => c.d !== "");

  const labels: MapLabel[] = Object.entries(LABEL_META).map(([country, meta]) => {
    const [x, y] = project(meta.lng, meta.lat);
    return {
      country,
      x,
      y,
      anchor: meta.anchor ?? "middle",
      dx: meta.dx ?? 0,
      dy: meta.dy ?? 4,
    };
  });

  const pins: MapPin[] = Object.entries(LEAD_COUNTRY_IDS)
    .filter(([, id]) => PIN_IDS.has(id))
    .map(([country]) => {
      const meta = LABEL_META[country];
      const [x, y] = project(meta.lng, meta.lat);
      return { country, x, y };
    });

  const places: MapPlace[] = Object.entries(PLACES_BY_COUNTRY).flatMap(([country, list]) =>
    list.map((p) => {
      const [x, y] = project(p.lng, p.lat);
      return { country, name: p.name, x, y, kind: p.kind, labelPos: p.labelPos };
    })
  );

  return { width, height, countries: mapCountries, labels, pins, places };
}
