import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgressCharts } from "@/components/ProgressCharts";
import { UserLoggers } from "@/components/UserLoggers";
import {
  Flame,
  Activity,
  Clock,
  Scale,
  Mail,
  Phone,
} from "lucide-react";

export const revalidate = 0; // Disable caching to fetch live logs

function calculateStreak(attendances: any[]) {
  if (attendances.length === 0) return 0;

  const dates = Array.from(
    new Set(
      attendances.map((a) => {
        const d = new Date(a.entryTime);
        const offset = d.getTimezoneOffset();
        const local = new Date(d.getTime() - offset * 60 * 1000);
        return local.toISOString().split("T")[0];
      })
    )
  ).sort((a, b) => b.localeCompare(a));

  let streak = 0;
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const todayStr = new Date(today.getTime() - offset * 60 * 1000).toISOString().split("T")[0];

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = new Date(yesterday.getTime() - offset * 60 * 1000).toISOString().split("T")[0];

  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
    return 0;
  }

  let currentExpected = new Date(dates[0]);

  for (let i = 0; i < dates.length; i++) {
    const expectedStr = currentExpected.toISOString().split("T")[0];
    if (dates[i] === expectedStr) {
      streak++;
      currentExpected.setDate(currentExpected.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Retrieve user complete details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      payments: { orderBy: { paymentDate: "desc" } },
      attendances: { orderBy: { entryTime: "desc" } },
      personalRecords: { orderBy: { date: "desc" } },
      weightLogs: { orderBy: { date: "asc" } },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const now = new Date();
  const latestPayment = user.payments[0];
  const isOverdue = !latestPayment || latestPayment.nextDueDate < now;

  let daysRemaining = 0;
  if (latestPayment && latestPayment.nextDueDate > now) {
    const diff = latestPayment.nextDueDate.getTime() - now.getTime();
    daysRemaining = Math.ceil(diff / (1000 * 3600 * 24));
  }

  const daysActive = Math.ceil((now.getTime() - user.joiningDate.getTime()) / (1000 * 3600 * 24)) || 1;
  const attendancePercentage = Math.min(100, Math.round((user.attendances.length / daysActive) * 100));
  const streak = calculateStreak(user.attendances);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider">Welcome Back, {user.name.split(" ")[0]}!</h1>
          <p className="text-sm text-zinc-400">Manage your lifting records, track daily check-ins, and verify membership dues.</p>
        </div>
        <div>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
              isOverdue
                ? "bg-red-950/40 border-2 border-red-900/60 text-red-400"
                : "bg-emerald-950/40 border-2 border-emerald-900/60 text-emerald-400"
            }`}
          >
            {isOverdue ? "Overdue - Renew Now" : "Membership Active"}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Gym Streak</span>
            <Flame className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white">{streak}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Consecutive check-in days</span>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Attendance Rate</span>
            <Activity className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white">{attendancePercentage}%</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">{user.attendances.length} visits total</span>
          </div>
        </div>

        {/* Days remaining */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Days Remaining</span>
            <Clock className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white">{daysRemaining}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium">Due: {latestPayment ? new Date(latestPayment.nextDueDate).toLocaleDateString() : "No Dues"}</span>
          </div>
        </div>

        {/* Weight */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">My Weight</span>
            <Scale className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white">{user.weight} kg</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Height: {user.height} cm</span>
          </div>
        </div>
      </div>

      {/* Progress Loggers */}
      <UserLoggers initialHeight={user.height} initialWeight={user.weight} />

      {/* Split Charts & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Panel (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-zinc-850">
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 font-black">My Physical & Lift Gains</h3>
            <ProgressCharts weightLogs={user.weightLogs} personalRecords={user.personalRecords} />
          </div>
        </div>

        {/* Account Info (1 col) */}
        <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4 h-fit">
          <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2 font-black">Profile Information</h3>
          <div className="space-y-3.5 text-xs text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Full Name:</span>
              <span className="font-semibold text-white">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Age / Gender:</span>
              <span className="font-semibold text-white">{user.age} yrs / {user.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Member Since:</span>
              <span className="font-semibold text-white">{new Date(user.joiningDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-900 text-zinc-400">
              <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <Phone className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <span>{user.mobileNumber}</span>
            </div>
            {user.medicalConditions && (
              <div className="pt-2 border-t border-zinc-900">
                <span className="text-zinc-500 text-[10px] uppercase font-bold block mb-1">Medical Conditions:</span>
                <p className="p-2 rounded bg-zinc-950 text-[11px] leading-relaxed italic text-zinc-400">{user.medicalConditions}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Attendance Log Table */}
        <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-black">My Attendance History</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-semibold">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Checked In</th>
                  <th className="py-2.5">Checked Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
                {user.attendances.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-zinc-500">No attendance logged yet.</td>
                  </tr>
                ) : (
                  user.attendances.slice(0, 10).map((att) => (
                    <tr key={att.id}>
                      <td className="py-2.5 font-medium">{new Date(att.date).toLocaleDateString()}</td>
                      <td className="py-2.5">{new Date(att.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-2.5">
                        {att.exitTime ? (
                          new Date(att.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        ) : (
                          <span className="text-red-500 font-bold uppercase text-[10px]">Active</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-black">My Payments & Dues</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-semibold">
                  <th className="py-2.5">Payment Date</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Months</th>
                  <th className="py-2.5">Expiry Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
                {user.payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-zinc-500">No payments found.</td>
                  </tr>
                ) : (
                  user.payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 font-medium">{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td className="py-2.5 font-semibold text-white">₹{p.amount}</td>
                      <td className="py-2.5">{p.durationMonths} Month(s)</td>
                      <td className="py-2.5 text-zinc-400 font-medium">{new Date(p.nextDueDate).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}