import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// Cache HTML in memory for performance (avoid reading disk on every request)
let cachedHtml: string | null = null;

function getSpaHtml(): string {
  if (cachedHtml) return cachedHtml;

  try {
    // Primary: read from public/ (available on all platforms)
    cachedHtml = readFileSync(join(process.cwd(), "public", "index.html"), "utf-8");
  } catch {
    try {
      // Fallback: read from dist/ (local dev)
      cachedHtml = readFileSync(join(process.cwd(), "dist", "index.html"), "utf-8");
    } catch {
      // Last resort: minimal HTML
      cachedHtml = `<!DOCTYPE html><html lang="id"><head><title>Inventaris LDTE</title></head><body><div id="root"></div><script>window.location.href="/login";</script></body></html>`;
    }
  }

  return cachedHtml;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- SKIP routes that should NOT be handled by the SPA ---

  // API routes → let Next.js handle them
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Next.js internals → let Next.js handle them
  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  // Vite SPA assets (hashed filenames) → serve as static files
  if (pathname.startsWith("/assets/")) {
    return NextResponse.next();
  }

  // Static files with extensions → serve as static files
  if (pathname.includes(".") && !pathname.endsWith("/")) {
    return NextResponse.next();
  }

  // --- SERVE SPA HTML for all other routes ---

  const html = getSpaHtml();

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next (Next.js internals)
     * - assets (Vite SPA assets)
     * - Files with extensions (static files)
     */
    "/((?!api|_next|assets|.*\\.).*)",
  ],
};
