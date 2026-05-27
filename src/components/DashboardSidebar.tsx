"use strict";
"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Dumbbell,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

type UserProp = {
  name?: string | null;
  email?: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
};

export function DashboardSidebar({ user }: { user: UserProp }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const getLinks = () => {
    const links = [];

    if (user.role === "USER") {
      links.push({
        label: "My Portal",
        href: "/dashboard/user",
        icon: LayoutDashboard,
      });
    }

    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      links.push(
        {
          label: "Admin Overview",
          href: "/dashboard/admin",
          icon: LayoutDashboard,
        },
        {
          label: "Manage Attendance",
          href: "/dashboard/admin/attendance",
          icon: CalendarCheck,
        },
        {
          label: "Fees & Payments",
          href: "/dashboard/admin/fees",
          icon: CreditCard,
        }
      );
    }

    if (user.role === "SUPER_ADMIN") {
      links.push({
        label: "Super Admin Panel",
        href: "/dashboard/super-admin",
        icon: Settings,
      });
    }

    return links;
  };

  const navLinks = getLinks();

  return (
    <>
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-900 fixed top-0 w-full z-40">
        <NextLink href="/" className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-red-600" />
          <span className="text-sm font-black tracking-wider text-white uppercase">U7 Gym Portal</span>
        </NextLink>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded text-zinc-400 hover:text-white"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-zinc-900 z-50 transform md:transform-none transition-transform duration-300 flex flex-col justify-between pt-16 md:pt-6 pb-6 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-4 space-y-6">
          {/* Logo Branding */}
          <div className="hidden md:flex items-center gap-2 mb-8">
            <Dumbbell className="h-8 w-8 text-red-600" />
            <span className="text-lg font-black tracking-wider text-white uppercase">
              U7 <span className="text-red-600">Fitness</span>
            </span>
          </div>

          {/* User Profile Info Card */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-850">
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{user.role.replace("_", " ")}</p>
            <p className="text-sm font-bold text-white truncate mt-0.5">{user.name || "Member"}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email || ""}</p>
          </div>

          {/* Nav Menu */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <NextLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-red-600 text-white shadow-md shadow-red-950/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </NextLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="px-4 pt-4 border-t border-zinc-900">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-zinc-400 hover:text-red-500 hover:bg-red-950/20 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
