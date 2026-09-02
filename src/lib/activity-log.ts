import { db } from "./db";

export async function logActivity(params: {
  logName?: string;
  description: string;
  subjectType?: string;
  subjectId?: number;
  event?: string;
  causerType?: string;
  causerId?: number;
  properties?: Record<string, unknown>;
}) {
  try {
    await db.activityLog.create({
      data: {
        logName: params.logName || "default",
        description: params.description,
        subjectType: params.subjectType || null,
        subjectId: params.subjectId || null,
        event: params.event || null,
        causerType: params.causerType || null,
        causerId: params.causerId || null,
        properties: (params.properties as Record<string, string>) || undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
