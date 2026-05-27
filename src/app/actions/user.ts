"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function logPersonalRecord(exercise: string, weight: number, reps: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized access" };
    }

    const userId = session.user.id;

    if (!exercise || weight <= 0 || reps <= 0) {
      return { success: false, message: "Please provide valid exercise details" };
    }

    await prisma.personalRecord.create({
      data: {
        userId,
        exercise,
        weight,
        reps,
        date: new Date(),
      },
    });

    revalidatePath("/dashboard/user");
    return { success: true, message: "Personal Record logged successfully!" };
  } catch (error: any) {
    console.error("Log PR error:", error);
    return { success: false, message: error.message || "Failed to log PR" };
  }
}

export async function logUserWeight(weight: number, height: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, message: "Unauthorized access" };
    }

    const userId = session.user.id;

    if (weight <= 0 || height <= 0) {
      return { success: false, message: "Please enter positive weight and height values" };
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    await prisma.$transaction(async (tx) => {
      // 1. Log weight entry
      await tx.weightLog.create({
        data: {
          userId,
          weight,
          height,
          bmi: Math.round(bmi * 10) / 10,
          date: new Date(),
        },
      });

      // 2. Update user latest metrics
      await tx.user.update({
        where: { id: userId },
        data: { weight, height },
      });
    });

    revalidatePath("/dashboard/user");
    return { success: true, message: "Weight log updated successfully!" };
  } catch (error: any) {
    console.error("Log weight error:", error);
    return { success: false, message: error.message || "Failed to update weight log" };
  }
}
