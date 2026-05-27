"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleAttendance(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's an existing entry for today
  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      userId,
      date: today,
    },
  });

  if (existingAttendance) {
    if (!existingAttendance.exitTime) {
      // Mark Exit
      await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { exitTime: new Date() },
      });
    }
  } else {
    // Mark Entry
    await prisma.attendance.create({
      data: {
        userId,
        date: today,
        entryTime: new Date(),
      },
    });
  }

  revalidatePath("/admin");
}

export async function logPersonalRecord(userId: string, formData: FormData) {
  const exercise = formData.get("exercise") as string;
  const weightLifted = parseFloat(formData.get("weightLifted") as string);

  await prisma.personalRecord.create({
    data: {
      userId,
      exercise,
      weightLifted,
    },
  });

  revalidatePath("/user");
}