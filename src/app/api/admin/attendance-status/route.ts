import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // 1. Authorization check: only Admin and Super Admin can fetch
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userIdsString = searchParams.get("userIds");

    if (!userIdsString) {
      return NextResponse.json({});
    }

    const userIds = userIdsString.split(",").filter((id) => id.length > 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Fetch all check-ins for these users today
    const attendances = await prisma.attendance.findMany({
      where: {
        userId: { in: userIds },
        entryTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: { entryTime: "desc" },
    });

    // Structure response: latest entry today is checked first.
    // If the latest entry has exitTime === null, then user is checkedIn: true.
    const result: {
      [userId: string]: {
        checkedIn: boolean;
        entryTime?: Date;
        exitTime?: Date | null;
      };
    } = {};

    // Initialize map
    userIds.forEach((id) => {
      result[id] = { checkedIn: false };
    });

    attendances.forEach((att) => {
      // Since it's ordered by entryTime desc, the first time we see a userId, it is their latest today
      if (result[att.userId] && !result[att.userId].entryTime) {
        result[att.userId] = {
          checkedIn: att.exitTime === null,
          entryTime: att.entryTime,
          exitTime: att.exitTime,
        };
      }
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Attendance status API error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}
