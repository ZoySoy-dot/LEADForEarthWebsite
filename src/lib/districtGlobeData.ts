import "server-only";

import { geoOrthographic, geoPath, geoGraticule } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import topology from "world-atlas/countries-110m.json";
import { LABEL_META, LEAD_COUNTRY_IDS } from "./districtMapData";

type CountryProps = { name?: string };

export type BBox = [[number, number], [number, number]];

export type GlobeCountry = {
  id: string;
  d: string;
  leadCountry: string | null;
  bbox: BBox | null;
};

export type GlobeStar = { country: string; x: number; y: number };

export type GlobeData = {
  size: number;
  countries: GlobeCountry[];
  graticuleD: string;
  stars: GlobeStar[];
};

const ID_TO_LEAD_COUNTRY: Record<string, string> = Object.fromEntries(
  Object.entries(LEAD_COUNTRY_IDS).map(([name, id]) => [id, name])
);

export function buildDistrictGlobeData(): GlobeData {
  const size = 520;
  const topo = topology as unknown as Topology;
  const collection = topo.objects.countries as GeometryCollection;
  const world = feature(topo, collection) as unknown as FeatureCollection<
    Geometry,
    CountryProps
  >;

  // Static view: centered over SE Asia so all seven LEAD sectors are visible.
  const projection = geoOrthographic()
    .scale(size / 2 - 6)
    .translate([size / 2, size / 2])
    .rotate([-115, -15])
    .clipAngle(90);
  const pathFn = geoPath(projection);

  const countries: GlobeCountry[] = world.features
    .map((f, i) => {
      // Some features (e.g. Antarctica, disputed territories) have no `id`,
      // which would collide into a shared "undefined" React key. Fall back to
      // the feature index so keys stay unique.
      const id = f.id != null ? String(f.id) : `feature-${i}`;
      const d = pathFn(f) ?? "";
      const leadCountry = ID_TO_LEAD_COUNTRY[id] ?? null;
      const bbox = leadCountry ? (pathFn.bounds(f) as BBox) : null;
      return { id, d, leadCountry, bbox };
    })
    .filter((c) => c.d !== "");

  const graticuleD = pathFn(geoGraticule().step([20, 20])()) ?? "";

  // Signum Fidei star markers, one per LEAD sector, placed at each country's
  // curated label point. Projection returns null for far-side points, which
  // would only happen if the default rotation stopped covering SE Asia.
  const stars: GlobeStar[] = Object.entries(LABEL_META)
    .filter(([country]) => country in LEAD_COUNTRY_IDS)
    .map(([country, meta]) => {
      const projected = projection([meta.lng, meta.lat]);
      if (!projected) return null;
      return { country, x: projected[0], y: projected[1] };
    })
    .filter((s): s is GlobeStar => s !== null);

  return { size, countries, graticuleD, stars };
}
