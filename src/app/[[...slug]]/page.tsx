export const dynamic = "force-dynamic";

/**
 * Catch-all route — serves the Vite-built SPA HTML.
 *
 * On Vercel, middleware.ts + readFileSync don't work in Edge Runtime.
 * Instead, we fetch the SPA HTML from /api/spa (a Node.js API route
 * that CAN read the filesystem) and render it via dangerouslySetInnerHTML.
 */
export default async function CatchAllPage() {
  let html = "";

  try {
    const protocol = process.env.VERCEL ? "https" : "http";
    const host = process.env.VERCEL
      ? process.env.VERCEL_URL || "localhost"
      : "localhost:3000";
    const res = await fetch(`${protocol}://${host}/api/spa`, {
      cache: "no-store",
    });
    if (res.ok) {
      html = await res.text();
    }
  } catch {
    // fallback
  }

  if (!html) {
    html = `<!DOCTYPE html><html lang="id"><head><title>Inventaris LDTE</title></head><body><div id="root"></div><script>window.location.href="/login";</script></body></html>`;
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
