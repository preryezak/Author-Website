/**
 * Edge Worker for eryezakalalu.com (Cloudflare free plan).
 *
 * The site itself is static assets served by Cloudflare with no Worker cost.
 * This script runs ONLY for the two paths listed in `run_worker_first`
 * (wrangler.toml), so every page, image and script stays free and untouched:
 *
 *   /video/*   Static assets do not answer HTTP Range requests, and iPhone Safari
 *              will not play an mp4 that cannot return 206. This adds byte-range
 *              support (and Accept-Ranges) for the brand film.
 *   /api/geo   Tells the page which region the visitor is in, so the editions
 *              block can open the right currency first (UGX in Africa, USD
 *              elsewhere). It stores nothing and sets no cookie.
 */

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

function parseRange(header: string, size: number): { start: number; end: number } | null {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m) return null;
  let start: number;
  let end: number;
  if (m[1] === "" && m[2] !== "") {
    const suffix = Number(m[2]);
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (!Number.isFinite(start) || start > end || start >= size) return null;
  return { start, end };
}

async function serveVideo(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  // Always fetch the whole file from assets (2 MB), then slice it ourselves.
  const upstream = await env.ASSETS.fetch(new Request(request.url, { method: "GET" }));
  if (!upstream.ok) return upstream;

  const headers = new Headers(upstream.headers);
  headers.delete("content-encoding");
  headers.delete("etag");
  headers.set("Accept-Ranges", "bytes");

  const rangeHeader = request.headers.get("Range");
  if (!rangeHeader) {
    return new Response(request.method === "HEAD" ? null : upstream.body, { status: 200, headers });
  }

  const body = await upstream.arrayBuffer();
  const range = parseRange(rangeHeader, body.byteLength);
  if (!range) {
    headers.set("Content-Range", `bytes */${body.byteLength}`);
    return new Response(null, { status: 416, headers });
  }
  const chunk = body.slice(range.start, range.end + 1);
  headers.set("Content-Range", `bytes ${range.start}-${range.end}/${body.byteLength}`);
  headers.set("Content-Length", String(chunk.byteLength));
  return new Response(request.method === "HEAD" ? null : chunk, { status: 206, headers });
}

function geo(request: Request): Response {
  const cf = (request as unknown as { cf?: { country?: string; continent?: string } }).cf || {};
  const country = cf.country || "";
  const continent = cf.continent || "";
  return new Response(JSON.stringify({ country, continent, region: continent === "AF" ? "ugx" : "usd" }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/geo") return geo(request);
    if (pathname.startsWith("/video/")) return serveVideo(request, env);
    return env.ASSETS.fetch(request);
  },
};
