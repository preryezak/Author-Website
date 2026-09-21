/**
 * Post-build step for the static-export deploy.
 *
 * `next build` with `output: "export"` writes the finished site to `out/`.
 *
 * The existing eryezakalalu.com deployment (the old Vite site) published its
 * assets from `dist/public` (see the superseded `wrangler.toml` on the
 * `archive/old-vite-site` branch: `[assets] directory = "./dist/public"`).
 * Cloudflare Pages projects built on that repo used `dist` as the output
 * directory. To work with BOTH conventions without touching the dashboard, the
 * export is mirrored to `dist/` and to `dist/public/`.
 *
 * We also write `_redirects` and a `_headers` passthrough so the single-page
 * export resolves unknown paths instead of returning a bare Cloudflare 404.
 */
import { cp, mkdir, rm, writeFile, access, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "out");
const dist = join(root, "dist");
const distPublic = join(dist, "public");

async function exists(p) {
  try { await access(p, constants.F_OK); return true; } catch { return false; }
}

async function count(dir) {
  let n = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    n += e.isDirectory() ? await count(join(dir, e.name)) : 1;
  }
  return n;
}

if (!(await exists(out))) {
  console.error("[postbuild] out/ not found - did `next build` run with output: 'export'?");
  process.exit(1);
}

// 1) out/ -> dist/
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(out, dist, { recursive: true });

// 2) out/ -> dist/public/ (the old Worker-assets convention)
await rm(distPublic, { recursive: true, force: true });
await mkdir(distPublic, { recursive: true });
await cp(out, distPublic, { recursive: true });

// Cloudflare fallback for a single-page export.
// dist/_redirects must not shadow dist/public/_redirects.
if (!(await exists(join(dist, "_redirects")))) {
  await writeFile(join(dist, "_redirects"), "/*    /index.html   200\n", "utf8");
}
if (!(await exists(join(distPublic, "_redirects")))) {
  await writeFile(join(distPublic, "_redirects"), "/*    /index.html   200\n", "utf8");
}

console.log(
  `[postbuild] mirrored out/ -> dist/ (${await count(dist)} files) and dist/public/ (${await count(distPublic)} files)`
);
