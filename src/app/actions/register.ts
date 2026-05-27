"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.number().int().min(10, "Age must be at least 10").max(100, "Age must be less than 100"),
  gender: z.string().min(1, "Please select a gender"),
  joiningDate: z.string().min(1, "Please select a joining date"),
  height: z.number().positive("Height must be positive"),
  weight: z.number().positive("Weight must be positive"),
  emergencyContact: z.string().min(10, "Emergency contact must be at least 10 digits"),
  medicalConditions: z.string().optional(),
  gymCode: z.string().min(1, "Secret Gym Code is required"),
});

export type RegisterState = {
  success?: boolean;
  error?: string;
};

export async function registerUser(prevState: any, formData: FormData): Promise<RegisterState> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      mobileNumber: formData.get("mobileNumber") as string,
      password: formData.get("password") as string,
      age: Number(formData.get("age")),
      gender: formData.get("gender") as string,
      joiningDate: formData.get("joiningDate") as string,
      height: Number(formData.get("height")),
      weight: Number(formData.get("weight")),
      emergencyContact: formData.get("emergencyContact") as string,
      medicalConditions: (formData.get("medicalConditions") as string) || undefined,
      gymCode: formData.get("gymCode") as string,
    };

    // Validate using Zod
    const validatedData = registerSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

    const {
      name,
      email,
      mobileNumber,
      password,
      age,
      gender,
      joiningDate,
      height,
      weight,
      emergencyContact,
      medicalConditions,
      gymCode,
    } = validatedData.data;

    // Validate Secret Gym Code
    const expectedGymCode = process.env.SECRET_GYM_CODE;
    if (!expectedGymCode) {
      return { error: "Gym registration code is not configured on the server. Please contact support." };
    }

    if (gymCode.trim() !== expectedGymCode.trim()) {
      return { error: "Invalid Secret Gym Code. Please check with U7 Fitness Gym management." };
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return { error: "Email is already registered. Please login instead." };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in transaction and log their initial weight
    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase().trim(),
          mobileNumber,
          password: hashedPassword,
          age,
          gender,
          joiningDate: new Date(joiningDate),
          height,
          weight,
          emergencyContact,
          medicalConditions,
          role: "USER", // Default role
        },
      });

      // Calculate BMI
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      // Create initial WeightLog
      await tx.weightLog.create({
        data: {
          userId: newUser.id,
          weight,
          height,
          bmi: Math.round(bmi * 10) / 10,
          date: new Date(joiningDate),
        },
      });
    });

    try {
      await sendWelcomeEmail(email.toLowerCase().trim(), name);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { error: error.message || "An unexpected database error occurred" };
  }
}
