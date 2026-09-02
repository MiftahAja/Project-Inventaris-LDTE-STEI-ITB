import "server-only";
import { redirect } from "next/navigation";
import { getSession, SessionPayload } from "./session";
import { db } from "./db";

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.role !== "admin") {
    redirect("/home");
  }
  return session;
}

export async function getUser(userId: number) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      tambahPetugas: true,
    },
  });
}

export async function canWriteToLab(userId: number, labId: number): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  if (session.role === "admin") return true;

  const assignment = await db.assignment.findFirst({
    where: {
      userId: session.userId,
      ruangLabId: labId,
      isActive: true,
    },
  });

  return !!assignment;
}

export async function getAssignedLabIds(userId: number): Promise<number[]> {
  const assignments = await db.assignment.findMany({
    where: { userId, isActive: true },
    select: { ruangLabId: true },
  });
  return assignments.map((a) => Number(a.ruangLabId));
}
