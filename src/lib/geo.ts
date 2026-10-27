/** One /api/geo request per page view, shared by the Pixel loader and the price display. */
let geoOnce: Promise<{ continent?: string; country?: string } | null> | null = null;
export function geo() {
  geoOnce ??= fetch("/api/geo", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  return geoOnce;
}
