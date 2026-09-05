import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getAssignedLabIds } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Admin has access to all labs
    if (session.role === "admin") {
      return NextResponse.json({ labIds: [] }); // Empty means all labs
    }

    const labIds = await getAssignedLabIds(Number(session.userId));
    return NextResponse.json({ labIds });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
