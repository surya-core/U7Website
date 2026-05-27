import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProgressCharts } from "@/components/ProgressCharts";
import {
  Scale,
  Activity,
  Flame,
  ArrowLeft,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable page caching to reflect recent changes

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

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const now = new Date();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      payments: { orderBy: { paymentDate: "desc" } },
      attendances: { orderBy: { entryTime: "desc" } },
      personalRecords: { orderBy: { date: "desc" } },
      weightLogs: { orderBy: { date: "asc" } },
    },
  });

  if (!user || user.role !== "USER") {
    notFound();
  }

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
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-white uppercase tracking-wider mt-1">{user.name}</h1>
          <p className="text-xs text-zinc-400">Member ID: {user.id}</p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
              isOverdue
                ? "bg-red-950/40 border-2 border-red-900/60 text-red-400"
                : "bg-emerald-950/40 border-2 border-emerald-900/60 text-emerald-400"
            }`}
          >
            {isOverdue ? "Membership Overdue" : "Membership Active"}
          </span>
        </div>
      </div>

      {/* KPI Stats Block */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Counter */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Lifting Streak</span>
            <Flame className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white">{streak}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium">Consecutive check-in days</span>
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
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium">{user.attendances.length} visits total</span>
          </div>
        </div>

        {/* Remaining Days */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Days Remaining</span>
            <Clock className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white">{daysRemaining}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium">Until next renewal</span>
          </div>
        </div>

        {/* Active Weight log */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Current Weight</span>
            <Scale className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white">{user.weight} kg</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium font-medium">Height: {user.height} cm</span>
          </div>
        </div>
      </div>

      {/* Split Content: Personal Info & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details (Left column) */}
        <div className="space-y-6">
          {/* Member Details */}
          <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2 font-black">Member Metadata</h3>
            
            <div className="space-y-3.5 text-sm text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Age:</span>
                <span className="text-white font-semibold">{user.age} Yrs ({user.gender})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Joined:</span>
                <span className="text-white font-semibold">{new Date(user.joiningDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 pt-1">
                <Mail className="h-4 w-4 shrink-0 text-zinc-600" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Phone className="h-4 w-4 shrink-0 text-zinc-600" />
                <span>{user.mobileNumber}</span>
              </div>
            </div>
          </div>

          {/* Safety & Emergency */}
          <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2 font-black">Health & Emergency</h3>
            
            <div className="space-y-3.5 text-sm text-zinc-300">
              <div>
                <span className="text-zinc-500 text-xs block mb-0.5">Emergency Contact</span>
                <span className="text-white font-bold block">{user.emergencyContact}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-xs block mb-0.5">Medical Conditions / Injuries</span>
                <span className="text-zinc-300 block text-xs bg-zinc-950 p-2.5 rounded border border-zinc-900 leading-relaxed italic">
                  {user.medicalConditions || "No conditions reported"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Charts & History (Right columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-zinc-850">
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 font-black">Member Progress Tracking</h3>
            <ProgressCharts weightLogs={user.weightLogs} personalRecords={user.personalRecords} />
          </div>
        </div>
      </div>

      {/* History Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Attendance Log Table */}
        <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-black">Attendance Log (Last 10 Days)</h3>
          
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
                    <td colSpan={3} className="py-4 text-center text-zinc-500">No logs found</td>
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
                          <span className="text-red-500 font-black tracking-widest text-[9px] uppercase">Active</span>
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
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-black">Payment History</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-semibold">
                  <th className="py-2.5">Payment Date</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Duration</th>
                  <th className="py-2.5">Expiry Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
                {user.payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-zinc-500">No payments registered</td>
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
