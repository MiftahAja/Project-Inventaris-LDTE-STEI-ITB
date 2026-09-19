import { NextRequest, NextResponse } from "next/server";

let cachedHtml: string | null = null;

async function getSpaHtml(origin: string): Promise<string> {
  if (cachedHtml) return cachedHtml;

  try {
    const res = await fetch(`${origin}/index.html`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (res.ok) {
      cachedHtml = await res.text();
      return cachedHtml;
    }
  } catch {
    // fallback
  }

  // Minimal fallback HTML
  return `<!DOCTYPE html><html lang="id"><head><title>Inventaris LDTE</title></head><body><div id="root"></div><script>window.location.href="/login";</script></body></html>`;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  // Serve SPA HTML for all other routes
  const origin = request.nextUrl.origin;
  const html = await getSpaHtml(origin);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next|assets|.*\\.).*)",
  ],
};
