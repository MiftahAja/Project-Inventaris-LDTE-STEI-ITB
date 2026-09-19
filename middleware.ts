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

  return `<!DOCTYPE html><html lang="id"><head><title>Inventaris LDTE</title></head><body><div id="root"></div><script>window.location.href="/login";</script></body></html>`;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) return NextResponse.next();
  if (pathname.startsWith("/_next/")) return NextResponse.next();
  if (pathname.startsWith("/assets/")) return NextResponse.next();
  if (pathname.includes(".") && !pathname.endsWith("/")) return NextResponse.next();

  const html = await getSpaHtml(request.nextUrl.origin);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next|assets|.*\\.).*)"],
};
