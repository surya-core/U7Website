"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendPaymentSuccessEmail } from "@/lib/email";

export async function getDashboardStats() {
  try {
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // 1. Total active members (has joining date and nextDueDate >= now)
    const totalMembers = await prisma.user.count({
      where: { role: "USER" },
    });

    const activeMembers = await prisma.user.count({
      where: {
        role: "USER",
        payments: {
          some: {
            nextDueDate: { gte: now },
          },
        },
      },
    });

    // 2. Today's attendance
    const todayAttendance = await prisma.attendance.count({
      where: {
        entryTime: { gte: todayStart },
      },
    });

    // 3. Monthly revenue (sum of payments in the last 30 days)
    const paymentsLast30Days = await prisma.payment.aggregate({
      where: {
        paymentDate: { gte: thirtyDaysAgo },
      },
      _sum: {
        amount: true,
      },
    });
    const monthlyRevenue = paymentsLast30Days._sum.amount || 0;

    // 4. Overdue members (members with at least one payment, but all payments have expired OR nextDueDate < now)
    // Actually, look at the latest payment for each user.
    const allUsers = await prisma.user.findMany({
      where: { role: "USER" },
      include: {
        payments: {
          orderBy: { nextDueDate: "desc" },
          take: 1,
        },
      },
    });

    let overdueCount = 0;
    for (const u of allUsers) {
      if (u.payments.length === 0) {
        overdueCount++; // No payments ever made = overdue
      } else {
        const latestPayment = u.payments[0];
        if (latestPayment.nextDueDate < now) {
          overdueCount++;
        }
      }
    }

    // 5. Recent Activity
    const recentAttendances = await prisma.attendance.findMany({
      take: 5,
      orderBy: { entryTime: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { paymentDate: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    const activities = [
      ...recentAttendances.map((att) => ({
        id: att.id,
        type: "ATTENDANCE" as const,
        title: `${att.user.name} checked in`,
        time: att.entryTime,
        detail: att.exitTime ? "Completed Session" : "Active Session",
      })),
      ...recentPayments.map((pay) => ({
        id: pay.id,
        type: "PAYMENT" as const,
        title: `${pay.user.name} paid fee`,
        time: pay.paymentDate,
        detail: `Amount: ₹${pay.amount} for ${pay.durationMonths} Month(s)`,
      })),
    ]
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 5);

    return {
      stats: {
        totalMembers,
        activeMembers,
        todayAttendance,
        monthlyRevenue,
        overdueMembers: overdueCount,
      },
      activities,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      stats: { totalMembers: 0, activeMembers: 0, todayAttendance: 0, monthlyRevenue: 0, overdueMembers: 0 },
      activities: [],
    };
  }
}

export async function searchMembers(query: string, statusFilter: string) {
  try {
    const now = new Date();
    const cleanQuery = query.trim().toLowerCase();

    // Query users matching search
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        OR: [
          { name: { contains: cleanQuery, mode: "insensitive" } },
          { email: { contains: cleanQuery, mode: "insensitive" } },
          { mobileNumber: { contains: cleanQuery } },
        ],
      },
      include: {
        payments: {
          orderBy: { nextDueDate: "desc" },
          take: 1,
        },
      },
    });

    // Map status and filter
    const mapped = users.map((u) => {
      const latestPayment = u.payments[0];
      const isOverdue = !latestPayment || latestPayment.nextDueDate < now;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        mobileNumber: u.mobileNumber,
        joiningDate: u.joiningDate,
        height: u.height,
        weight: u.weight,
        nextDueDate: latestPayment ? latestPayment.nextDueDate : null,
        status: isOverdue ? ("OVERDUE" as const) : ("ACTIVE" as const),
      };
    });

    if (statusFilter === "ACTIVE") {
      return mapped.filter((m) => m.status === "ACTIVE");
    }
    if (statusFilter === "OVERDUE") {
      return mapped.filter((m) => m.status === "OVERDUE");
    }

    return mapped;
  } catch (error) {
    console.error("Search members error:", error);
    return [];
  }
}

export async function recordAttendance(userId: string) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Look for an active entry today (entryTime today, exitTime null)
    const activeAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        entryTime: {
          gte: todayStart,
          lte: todayEnd,
        },
        exitTime: null,
      },
    });

    if (activeAttendance) {
      // Exit action: Update exit time
      await prisma.attendance.update({
        where: { id: activeAttendance.id },
        data: { exitTime: new Date() },
      });
      revalidatePath("/dashboard/admin/attendance");
      return { success: true, type: "EXIT" as const, message: "Checked out successfully" };
    } else {
      // Entry action: Create new attendance log
      await prisma.attendance.create({
        data: {
          userId,
          entryTime: new Date(),
          date: new Date(),
        },
      });
      revalidatePath("/dashboard/admin/attendance");
      return { success: true, type: "ENTRY" as const, message: "Checked in successfully" };
    }
  } catch (error: any) {
    console.error("Record attendance error:", error);
    return { success: false, message: error.message || "Failed to log attendance" };
  }
}

export async function addPayment(
  userId: string,
  amount: number,
  durationMonths: number,
  height: number,
  weight: number
) {
  try {
    const now = new Date();

    // Fetch user and latest payment
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        payments: {
          orderBy: { nextDueDate: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const latestPayment = user.payments[0];

    // Calculate next due date
    let baseDate = now;
    if (latestPayment && latestPayment.nextDueDate > now) {
      baseDate = latestPayment.nextDueDate;
    }

    const nextDueDate = new Date(baseDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + durationMonths);

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    await prisma.$transaction(async (tx) => {
      // 1. Create Payment record
      await tx.payment.create({
        data: {
          userId,
          amount,
          durationMonths,
          paymentDate: now,
          nextDueDate,
          heightAtPayment: height,
          weightAtPayment: weight,
        },
      });

      // 2. Update user dimensions
      await tx.user.update({
        where: { id: userId },
        data: { height, weight },
      });

      // 3. Log weight history
      await tx.weightLog.create({
        data: {
          userId,
          weight,
          height,
          bmi: Math.round(bmi * 10) / 10,
          date: now,
        },
      });
    });

    revalidatePath("/dashboard/admin/fees");
    revalidatePath(`/dashboard/admin/members/${userId}`);

    try {
      await sendPaymentSuccessEmail(user.email, user.name, amount, nextDueDate);
    } catch (err) {
      console.error("Failed to send payment success email:", err);
    }

    return { success: true, message: "Payment added successfully" };
  } catch (error: any) {
    console.error("Add payment error:", error);
    return { success: false, message: error.message || "Failed to process payment" };
  }
}
