import { NextRequest, NextResponse } from "next/server";
import { deleteSession, getSession } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  // Get user info before deleting session
  const session = await getSession();
  if (session?.userId) {
    const user = await db.user.findUnique({
      where: { id: BigInt(session.userId) },
      select: { id: true, name: true },
    });
    if (user) {
      logActivity({
        logName: "auth",
        description: `${user.name} berhasil logout`,
        subjectType: "User",
        subjectId: Number(user.id),
        event: "logout",
        causerId: Number(user.id),
      });
    }
  }
  await deleteSession();
  return NextResponse.redirect(new URL("/login", req.url));
}
