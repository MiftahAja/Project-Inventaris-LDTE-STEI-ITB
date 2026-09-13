import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

/**
 * Catch-all route as a fallback for platforms that don't support proxy.ts.
 *
 * In production, src/proxy.ts intercepts all SPA routes and serves the
 * Vite-built index.html directly as a raw HTTP response. This bypasses
 * the Next.js layout entirely, avoiding nested <html>/<body> issues.
 *
 * This page only executes if proxy.ts is not available (e.g., some
 * hosting platforms). In that case, we read and render the SPA HTML
 * via dangerouslySetInnerHTML as a last resort.
 */
export default function CatchAllPage() {
  let html = "";
  try {
    html = readFileSync(join(process.cwd(), "public", "index.html"), "utf-8");
  } catch {
    try {
      html = readFileSync(join(process.cwd(), "dist", "index.html"), "utf-8");
    } catch {
      html = `<!DOCTYPE html><html lang="id"><head><title>Inventaris LDTE</title></head><body><div id="root"></div><script>window.location.href="/login";</script></body></html>`;
    }
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
