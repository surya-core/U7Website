"use strict";
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Dumbbell, User, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Dumbbell className="h-8 w-8 text-red-600 group-hover:rotate-45 transition-transform duration-300" />
              <span className="text-xl font-black tracking-wider text-white uppercase">
                U7 <span className="text-red-600">Fitness</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium text-zinc-300 hover:text-red-600 transition-colors">
              Features
            </Link>
            <Link href="#plans" className="text-sm font-medium text-zinc-300 hover:text-red-600 transition-colors">
              Pricing
            </Link>
            <Link href="#bmi" className="text-sm font-medium text-zinc-300 hover:text-red-600 transition-colors">
              BMI Calculator
            </Link>
            <Link href="#trainers" className="text-sm font-medium text-zinc-300 hover:text-red-600 transition-colors">
              Trainers
            </Link>
            <Link href="#contact" className="text-sm font-medium text-zinc-300 hover:text-red-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 h-10 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-3 h-10 rounded-md border border-zinc-800 hover:border-red-600/30 hover:bg-red-950/20 text-zinc-400 hover:text-red-500 text-sm transition-all"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 h-10 rounded-md border border-zinc-800 hover:border-red-600/30 hover:bg-red-950/20 text-zinc-200 hover:text-red-500 font-semibold text-sm transition-all flex items-center"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 h-10 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors flex items-center"
                >
                  Join U7 Gym
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-zinc-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-900 px-2 pt-2 pb-4 space-y-1 sm:px-3">
          <Link
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-red-500 hover:bg-zinc-900"
          >
            Features
          </Link>
          <Link
            href="#plans"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-red-500 hover:bg-zinc-900"
          >
            Pricing
          </Link>
          <Link
            href="#bmi"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-red-500 hover:bg-zinc-900"
          >
            BMI Calculator
          </Link>
          <Link
            href="#trainers"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-red-500 hover:bg-zinc-900"
          >
            Trainers
          </Link>
          <Link
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-red-500 hover:bg-zinc-900"
          >
            Contact
          </Link>
          <div className="pt-4 border-t border-zinc-900 flex flex-col gap-2">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-center items-center gap-2 py-2.5 rounded-md bg-red-600 text-white font-semibold text-sm"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full flex justify-center items-center gap-2 py-2.5 rounded-md border border-zinc-800 text-zinc-400 hover:bg-red-950/20"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-center items-center py-2.5 rounded-md border border-zinc-800 text-zinc-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-center items-center py-2.5 rounded-md bg-red-600 text-white font-semibold"
                >
                  Join U7 Gym
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
