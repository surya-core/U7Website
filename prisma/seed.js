"use strict";

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clear database tables
  await prisma.personalRecord.deleteMany();
  await prisma.weightLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database cleared.");

  // 2. Generate Hashed Password
  const hashedPassword = await bcrypt.hash("befit123", 10);
  const hashedPassword2 = await bcrypt.hash("rjcfth342", 10);

  // 3. Create Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      name: "U7 Super Admin",
      email: "u7fitnessclub@gmail.com",
      password: hashedPassword,
      mobileNumber: "9999999999",
      age: 30,
      gender: "Male",
      joiningDate: new Date("2026-01-01"),
      height: 175,
      weight: 80,
      emergencyContact: "9999999999",
      role: "SUPER_ADMIN",
    },
  });
  console.log("Super Admin account seeded:", superAdmin.email);

  // 4. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "U7 Staff Admin",
      email: "admin@u7fitness.com",
      password: hashedPassword2,
      mobileNumber: "8888888888",
      age: 28,
      gender: "Male",
      joiningDate: new Date("2026-01-05"),
      height: 180,
      weight: 85,
      emergencyContact: "8888888888",
      role: "ADMIN",
    },
  });
  console.log("Admin account seeded:", admin.email);

  // 5. Create Test Users
  const user1 = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      password: hashedPassword,
      mobileNumber: "9876543210",
      age: 24,
      gender: "Male",
      joiningDate: new Date("2026-04-01"),
      height: 172,
      weight: 70,
      emergencyContact: "9876543211",
      role: "USER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya@gmail.com",
      password: hashedPassword,
      mobileNumber: "9876543220",
      age: 22,
      gender: "Female",
      joiningDate: new Date("2026-04-15"),
      height: 162,
      weight: 54,
      emergencyContact: "9876543221",
      role: "USER",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Amit Kumar",
      email: "amit@gmail.com",
      password: hashedPassword,
      mobileNumber: "9876543230",
      age: 27,
      gender: "Male",
      joiningDate: new Date("2026-03-01"),
      height: 178,
      weight: 82,
      emergencyContact: "9876543231",
      role: "USER",
    },
  });
  console.log("User accounts seeded.");

  // 6. Seed Weight Logs
  await prisma.weightLog.createMany({
    data: [
      { userId: user1.id, weight: 72.0, height: 172, bmi: 24.3, date: new Date("2026-04-01") },
      { userId: user1.id, weight: 70.8, height: 172, bmi: 23.9, date: new Date("2026-04-20") },
      { userId: user1.id, weight: 70.0, height: 172, bmi: 23.7, date: new Date("2026-05-15") },

      { userId: user2.id, weight: 56.2, height: 162, bmi: 21.4, date: new Date("2026-04-15") },
      { userId: user2.id, weight: 55.0, height: 162, bmi: 21.0, date: new Date("2026-05-01") },
      { userId: user2.id, weight: 54.0, height: 162, bmi: 20.6, date: new Date("2026-05-20") },

      { userId: user3.id, weight: 85.0, height: 178, bmi: 26.8, date: new Date("2026-03-01") },
      { userId: user3.id, weight: 83.5, height: 178, bmi: 26.4, date: new Date("2026-04-01") },
      { userId: user3.id, weight: 82.0, height: 178, bmi: 25.9, date: new Date("2026-05-01") },
    ],
  });
  console.log("Weight logs seeded.");

  // 7. Seed Payments (Active and Expired)
  const activeDueDate = new Date();
  activeDueDate.setMonth(activeDueDate.getMonth() + 1);

  const expiredDueDate = new Date();
  expiredDueDate.setDate(expiredDueDate.getDate() - 5);

  await prisma.payment.createMany({
    data: [
      // Rahul: Active payment
      {
        userId: user1.id,
        amount: 1200,
        durationMonths: 1,
        paymentDate: new Date("2026-05-01"),
        nextDueDate: activeDueDate,
        heightAtPayment: 172,
        weightAtPayment: 70,
      },
      // Priya: Active payment
      {
        userId: user2.id,
        amount: 1500,
        durationMonths: 1,
        paymentDate: new Date("2026-05-10"),
        nextDueDate: activeDueDate,
        heightAtPayment: 162,
        weightAtPayment: 54,
      },
      // Amit: Expired (Overdue) payment
      {
        userId: user3.id,
        amount: 1200,
        durationMonths: 1,
        paymentDate: new Date("2026-03-01"),
        nextDueDate: expiredDueDate,
        heightAtPayment: 178,
        weightAtPayment: 85,
      },
    ],
  });
  console.log("Payment logs seeded.");

  // 8. Seed Attendance (Logs in last 5 days to simulate streaks)
  const getPastDateStr = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  await prisma.attendance.createMany({
    data: [
      // Rahul: 3-day active streak (today, yesterday, 2 days ago)
      { userId: user1.id, date: getPastDateStr(0), entryTime: new Date(getPastDateStr(0).setHours(6, 15)), exitTime: new Date(getPastDateStr(0).setHours(7, 30)) },
      { userId: user1.id, date: getPastDateStr(1), entryTime: new Date(getPastDateStr(1).setHours(6, 20)), exitTime: new Date(getPastDateStr(1).setHours(7, 45)) },
      { userId: user1.id, date: getPastDateStr(2), entryTime: new Date(getPastDateStr(2).setHours(6, 0)), exitTime: new Date(getPastDateStr(2).setHours(7, 15)) },

      // Priya: checked in yesterday
      { userId: user2.id, date: getPastDateStr(1), entryTime: new Date(getPastDateStr(1).setHours(17, 30)), exitTime: new Date(getPastDateStr(1).setHours(19, 0)) },

      // Amit: checked in 4 days ago
      { userId: user3.id, date: getPastDateStr(4), entryTime: new Date(getPastDateStr(4).setHours(8, 0)), exitTime: new Date(getPastDateStr(4).setHours(9, 30)) },
    ],
  });
  console.log("Attendance logs seeded.");

  // 9. Seed Personal Records
  await prisma.personalRecord.createMany({
    data: [
      { userId: user1.id, exercise: "SQUAT", weight: 95.0, reps: 5, date: new Date("2026-04-10") },
      { userId: user1.id, exercise: "SQUAT", weight: 100.0, reps: 3, date: new Date("2026-05-10") },
      { userId: user1.id, exercise: "BENCH_PRESS", weight: 70.0, reps: 5, date: new Date("2026-04-15") },
      { userId: user1.id, exercise: "BENCH_PRESS", weight: 75.0, reps: 4, date: new Date("2026-05-18") },

      { userId: user2.id, exercise: "DEADLIFT", weight: 60.0, reps: 5, date: new Date("2026-04-20") },
      { userId: user2.id, exercise: "DEADLIFT", weight: 65.0, reps: 5, date: new Date("2026-05-12") },

      { userId: user3.id, exercise: "SHOULDER_PRESS", weight: 50.0, reps: 5, date: new Date("2026-03-15") },
      { userId: user3.id, exercise: "SHOULDER_PRESS", weight: 55.0, reps: 4, date: new Date("2026-04-25") },
    ],
  });
  console.log("Personal Records seeded.");

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
