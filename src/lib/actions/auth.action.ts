"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Handles securely registering a new gym member using the Secret Gym Code,
 * creating their Supabase Auth record, and their Prisma Database profile.
 */
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const mobile = formData.get("mobile") as string;
  const password = formData.get("password") as string;
  const secretCode = formData.get("secretCode") as string;

  // 1. Validate Secret Gym Code
  if (secretCode !== process.env.SECRET_GYM_CODE) {
    throw new Error("Invalid gym secret code. Please ask the front desk.");
  }

  // 2. Check if mobile number already exists in our Prisma DB
  // (Supabase will automatically check if the email exists)
  const existingMobile = await prisma.user.findUnique({
    where: { mobile }
  });

  if (existingMobile) {
    throw new Error("A user with this mobile number already exists.");
  }

  // Initialize Supabase Server Client
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 3. Create User in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      }
    }
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message || "Failed to create authentication record.");
  }

  // 4. Create User Profile in Prisma Database (Linking the Supabase ID)
  try {
    await prisma.user.create({
      data: {
        id: authData.user.id, // This links our DB to Supabase Auth
        name,
        email,
        mobile,
        // Default demographics (these would be updated later in the user profile)
        age: 18, 
        gender: "OTHER", 
        height: 0,
        weight: 0,
        emergencyContact: "Not provided",
      }
    });
  } catch (error) {
    // Note: In a highly robust production app, if Prisma fails here, 
    // you would want to delete the Supabase auth user to prevent orphaned accounts.
    console.error("Database creation failed:", error);
    throw new Error("Failed to create database profile.");
  }

  // 5. Redirect to dashboard (Middleware will route Admin/User appropriately)
  redirect("/user");
}

/**
 * Handles logging in an existing user using Supabase Auth.
 */
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Initialize Supabase Server Client
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Attempt Sign In
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Invalid login credentials.");
  }

  // Redirect to dashboard (Middleware will route Admin/User appropriately)
  redirect("/user");
}