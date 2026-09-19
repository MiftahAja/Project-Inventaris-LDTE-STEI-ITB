import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

let cachedHtml: string | null = null;

function getSpaHtml(): string {
  if (cachedHtml) return cachedHtml;

  try {
    cachedHtml = readFileSync(join(process.cwd(), "public", "index.html"), "utf-8");
  } catch {
    try {
      cachedHtml = readFileSync(join(process.cwd(), "dist", "index.html"), "utf-8");
    } catch {
      cachedHtml = `<!DOCTYPE html><html lang="id"><head><title>Inventaris LDTE</title></head><body><div id="root"></div><script>window.location.href="/login";</script></body></html>`;
    }
  }

  return cachedHtml;
}

export async function GET() {
  const html = getSpaHtml();

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
