"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Dumbbell } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2 text-red-600">
            <Dumbbell size={32} />
            <span className="font-bold text-2xl tracking-tighter text-white">U7 FITNESS</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-neutral-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-neutral-300 hover:text-white transition-colors">Plans</a>
            <a href="#trainers" className="text-neutral-300 hover:text-white transition-colors">Trainers</a>
            <Link href="/login" className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all">
              Member Login
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-neutral-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/login" className="block px-3 py-2 text-red-500 font-bold">Member Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}