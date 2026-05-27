"use strict";
"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Dumbbell, ShieldAlert, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRegSuccess, setShowRegSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowRegSuccess(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password: password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Invalid email or password");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="flex flex-col items-center mb-6">
        <Dumbbell className="h-10 w-10 text-red-600 mb-2" />
        <h2 className="text-3xl font-black text-white uppercase tracking-wider text-center">
          Sign In Portal
        </h2>
        <p className="text-sm text-zinc-400 mt-1">U7 Fitness Gym • Palam Colony</p>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8 border border-zinc-800 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {showRegSuccess && (
            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 text-sm flex items-start gap-3 animate-fadeIn">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>Registration complete! Use your credentials to sign in below.</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-950/40 border border-red-900/30 text-red-400 text-sm flex items-start gap-3 animate-shake">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@u7fitness.com"
              className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-900/50 border border-zinc-850 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-850 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-red-500 hover:underline font-semibold">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
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

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
          <p className="text-zinc-500 text-sm">Loading sign in portal...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
