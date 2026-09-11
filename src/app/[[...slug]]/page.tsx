import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export default function CatchAllPage() {
  // On Vercel, read the Vite-built SPA index.html from dist/
  // All routes are handled by React Router on the client side
  let html = "";
  try {
    html = readFileSync(join(process.cwd(), "dist", "index.html"), "utf-8");
  } catch {
    html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/login"/></head><body></body></html>`;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
