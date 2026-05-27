"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            FORGE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">LEGACY</span>
          </h1>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Join a community of dedicated athletes. Top-tier equipment, professional guidance, and an environment built for pure progression.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#pricing" className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-transform hover:scale-105 w-full sm:w-auto">
              View Memberships
            </a>
            <a href="#features" className="px-8 py-4 bg-transparent border border-neutral-700 hover:border-neutral-500 text-white font-bold rounded-lg transition-colors w-full sm:w-auto">
              Explore Gym
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}