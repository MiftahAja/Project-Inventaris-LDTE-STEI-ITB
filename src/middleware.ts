import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

// Routes that don't require authentication
const publicRoutes = new Set(["/login", "/register", "/"]);

// Routes that are read-only public (barang, unit-barang, ruang-lab, meja index)
const readOnlyPublicRoutes = new Set(["/barang", "/unit-barang", "/ruang-lab", "/meja"]);

// Static file prefixes to skip
const STATIC_PREFIXES = ["/_next", "/api", "/favicon.ico"];
const STATIC_EXTENSIONS = [".ico", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".css", ".js", ".woff", ".woff2"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Fast path: skip static files and API routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if route is public (fast Set lookup)
  const isPublicRoute = publicRoutes.has(path);

  // Decrypt session from cookie
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // Redirect to login if not authenticated and accessing protected route
  if (!session && !isPublicRoute) {
    // Allow read-only public routes without auth (fast Set lookup)
    if (!readOnlyPublicRoutes.has(path)) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  // Redirect to home if already logged in and accessing login/register
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/home", req.nextUrl));
  }

  // Redirect root to login or home based on auth
  if (path === "/") {
    return NextResponse.redirect(
      new URL(session ? "/home" : "/login", req.nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
