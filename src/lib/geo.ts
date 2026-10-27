/** One /api/geo request per page view, shared by the head Pixel script (window.__ekGeo), the Pixel loader and the price display. */
type Geo = { continent?: string; country?: string } | null;
let geoOnce: Promise<Geo> | null = null;
export function geo(): Promise<Geo> {
  const early = (window as unknown as { __ekGeo?: Promise<Geo> }).__ekGeo;
  geoOnce ??= early ?? fetch("/api/geo", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return geoOnce;
}
