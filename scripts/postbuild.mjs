/**
 * Post-build step for the static-export deploy.
 *
 * `next build` with `output: "export"` writes the finished site to `out/`.
 * The existing Cloudflare Pages project for eryezakalalu.com is configured with
 * build output directory `dist` (inherited from the old Vite site), so we mirror
 * `out/` into `dist/` to keep that project working with no dashboard changes.
 *
 * We also write `_redirects` so unknown paths fall back to the single-page
 * export rather than a bare Cloudflare 404.
 */
import { cp, mkdir, rm, writeFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, "out");
const dist = join(root, "dist");

async function exists(p) {
  try { await access(p, constants.F_OK); return true; } catch { return false; }
}

if (!(await exists(out))) {
  console.error("[postbuild] out/ not found - did `next build` run with output: 'export'?");
  process.exit(1);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(out, dist, { recursive: true });

// Cloudflare Pages SPA-style fallback for a single-page export.
if (!(await exists(join(dist, "_redirects")))) {
  await writeFile(join(dist, "_redirects"), "/*    /index.html   200\n", "utf8");
}

const { readdir } = await import("node:fs/promises");
async function count(dir) {
  let n = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    n += e.isDirectory() ? await count(join(dir, e.name)) : 1;
  }
  return n;
}
console.log(`[postbuild] mirrored out/ -> dist/ (${await count(dist)} files)`);
