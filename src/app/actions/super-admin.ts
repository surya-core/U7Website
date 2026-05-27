"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

async function verifySuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized access. Super Admin credentials required.");
  }
}

export async function getUsersList() {
  try {
    await verifySuperAdmin();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      include: {
        payments: { orderBy: { paymentDate: "desc" }, take: 1 },
      },
    });

    return {
      success: true,
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        mobileNumber: u.mobileNumber,
        role: u.role,
        age: u.age,
        gender: u.gender,
        joiningDate: u.joiningDate,
        height: u.height,
        weight: u.weight,
        emergencyContact: u.emergencyContact,
        medicalConditions: u.medicalConditions,
        nextDueDate: u.payments.length > 0 ? u.payments[0].nextDueDate : null,
      })),
    };
  } catch (error: any) {
    console.error("Super Admin getUsersList error:", error);
    return { success: false, message: error.message || "Failed to load users" };
  }
}

export async function updateUserRole(userId: string, newRole: Role) {
  try {
    await verifySuperAdmin();
    
    // Prevent self-demotion
    const session = await getServerSession(authOptions);
    if (session?.user.id === userId) {
      return { success: false, message: "You cannot change your own role!" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/dashboard/super-admin");
    return { success: true, message: "User role updated successfully" };
  } catch (error: any) {
    console.error("Super Admin updateUserRole error:", error);
    return { success: false, message: error.message || "Failed to update role" };
  }
}

export async function deleteUser(userId: string) {
  try {
    await verifySuperAdmin();

    // Prevent self-deletion
    const session = await getServerSession(authOptions);
    if (session?.user.id === userId) {
      return { success: false, message: "You cannot delete your own account!" };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/dashboard/super-admin");
    return { success: true, message: "User deleted successfully" };
  } catch (error: any) {
    console.error("Super Admin deleteUser error:", error);
    return { success: false, message: error.message || "Failed to delete user" };
  }
}

export async function editUserRecord(userId: string, data: any) {
  try {
    await verifySuperAdmin();

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        mobileNumber: data.mobileNumber,
        age: Number(data.age),
        gender: data.gender,
        height: Number(data.height),
        weight: Number(data.weight),
        emergencyContact: data.emergencyContact,
        medicalConditions: data.medicalConditions || null,
      },
    });

    revalidatePath("/dashboard/super-admin");
    revalidatePath(`/dashboard/admin/members/${userId}`);
    return { success: true, message: "User profile updated successfully" };
  } catch (error: any) {
    console.error("Super Admin editUserRecord error:", error);
    return { success: false, message: error.message || "Failed to update profile record" };
  }
}

export async function getDbLogs() {
  try {
    await verifySuperAdmin();

    const payments = await prisma.payment.findMany({
      orderBy: { paymentDate: "desc" },
      take: 20,
      include: { user: { select: { name: true } } },
    });

    const attendances = await prisma.attendance.findMany({
      orderBy: { entryTime: "desc" },
      take: 20,
      include: { user: { select: { name: true } } },
    });

    return {
      success: true,
      payments: payments.map((p) => ({
        id: p.id,
        userName: p.user.name,
        amount: p.amount,
        durationMonths: p.durationMonths,
        paymentDate: p.paymentDate,
        nextDueDate: p.nextDueDate,
      })),
      attendances: attendances.map((a) => ({
        id: a.id,
        userName: a.user.name,
        date: a.date,
        entryTime: a.entryTime,
        exitTime: a.exitTime,
      })),
    };
  } catch (error: any) {
    console.error("Super Admin getDbLogs error:", error);
    return { success: false, message: error.message || "Failed to fetch logs" };
  }
}

export async function deletePaymentRecord(paymentId: string) {
  try {
    await verifySuperAdmin();

    await prisma.payment.delete({
      where: { id: paymentId },
    });

    revalidatePath("/dashboard/super-admin");
    return { success: true, message: "Payment log deleted from database" };
  } catch (error: any) {
    console.error("Super Admin deletePayment error:", error);
    return { success: false, message: error.message || "Failed to delete payment log" };
  }
}

export async function deleteAttendanceRecord(attendanceId: string) {
  try {
    await verifySuperAdmin();

    await prisma.attendance.delete({
      where: { id: attendanceId },
    });

    revalidatePath("/dashboard/super-admin");
    return { success: true, message: "Attendance log deleted from database" };
  } catch (error: any) {
    console.error("Super Admin deleteAttendance error:", error);
    return { success: false, message: error.message || "Failed to delete attendance log" };
  }
}
