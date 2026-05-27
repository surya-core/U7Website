"use strict";
"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/register";
import { Dumbbell, ShieldAlert, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const response = await registerUser(null, formData);
      if (response.error) {
        setError(response.error);
      } else if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 2000);
      }
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex flex-col items-center mb-6">
          <Dumbbell className="h-10 w-10 text-red-600 mb-2" />
          <h2 className="text-3xl font-black text-white uppercase tracking-wider text-center">
            Create Member Account
          </h2>
          <p className="text-sm text-zinc-400 mt-1">U7 Fitness Gym • Palam Colony</p>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8 border border-zinc-800 shadow-2xl">
          {success ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
              <div className="p-4 bg-emerald-950/40 border border-emerald-900/30 text-emerald-500 rounded-full">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-white">Registration Successful!</h3>
              <p className="text-zinc-400 text-sm max-w-xs">
                Your account is active. Redirecting you to the login page to sign in...
              </p>
              <Loader2 className="h-5 w-5 text-red-600 animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-950/40 border border-red-900/30 text-red-400 text-sm flex items-start gap-3 animate-shake">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Group 1: Account Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-black text-red-500 tracking-wider">1. Account Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Mobile Number</label>
                    <input
                      name="mobileNumber"
                      type="tel"
                      required
                      placeholder="e.g. 9999988888"
                      className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Password</label>
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Demographics & Metrics */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <h3 className="text-xs uppercase font-black text-red-500 tracking-wider">2. Member Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Age</label>
                    <input
                      name="age"
                      type="number"
                      required
                      placeholder="e.g. 24"
                      className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Gender</label>
                    <select
                      name="gender"
                      required
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Joining Date</label>
                    <input
                      name="joiningDate"
                      type="date"
                      required
                      defaultValue={new Date().toISOString().split("T")[0]}
                      className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Height (cm)</label>
                    <input
                      name="height"
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 175"
                      className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Weight (kg)</label>
                    <input
                      name="weight"
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 70"
                      className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Emergency Phone</label>
                    <input
                      name="emergencyContact"
                      type="tel"
                      required
                      placeholder="Emergency contact"
                      className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Health Conditions & Gym Secret Code */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <h3 className="text-xs uppercase font-black text-red-500 tracking-wider">3. Health & verification</h3>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">Medical Conditions / Injuries (Optional)</label>
                  <textarea
                    name="medicalConditions"
                    placeholder="e.g. Knee pain, asthma, lower back disc issue (or leave blank)"
                    rows={2}
                    className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-red-500 mb-1 uppercase tracking-widest">Secret Gym Code</label>
                  <input
                    name="gymCode"
                    type="password"
                    required
                    placeholder="Enter code provided by U7 Gym"
                    className="w-full bg-zinc-900/70 border-2 border-red-900/40 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600 focus:ring-0 transition-colors placeholder:text-zinc-600 font-bold"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Contact the counter desk or trainer to receive the entry passcode.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-850 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 active:scale-98"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  "Create Account & Join Gym"
                )}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-center text-xs text-zinc-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-red-500 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
