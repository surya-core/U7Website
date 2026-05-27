import React from "react";
import { getDashboardStats } from "@/app/actions/admin";
import { AdminMemberSearch } from "@/components/AdminMemberSearch";
import {
  Users,
  Activity,
  DollarSign,
  AlertTriangle,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboard() {
  const { stats, activities } = await getDashboardStats();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">Admin Dashboard</h1>
        <p className="text-sm text-zinc-400">Gym analytics and member lookup for U7 Fitness Gym.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Members */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Active Members</span>
            <Users className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white">{stats.activeMembers}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium">Total Registered: {stats.totalMembers}</span>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Daily Attendance</span>
            <Activity className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white">{stats.todayAttendance}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium">Today's Check-ins</span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">30D Revenue</span>
            <DollarSign className="h-5 w-5 text-red-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white">₹{stats.monthlyRevenue}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium font-medium">Fees last 30 days</span>
          </div>
        </div>

        {/* Overdue Members */}
        <div className="glass-card p-5 rounded-2xl border border-zinc-850 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/5 rounded-full blur-xl" />
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Overdue Alerts</span>
            <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-white text-red-500">{stats.overdueMembers}</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5 font-medium">Dues expired/missing</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search & Lookup Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-zinc-850">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 font-black">Member Directory</h2>
            <AdminMemberSearch />
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-zinc-850">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 font-black">Recent Activity</h2>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-6">No recent updates.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="flex gap-3 items-start text-xs border-b border-zinc-900/60 pb-3 last:border-b-0 last:pb-0">
                    <div className="p-2 rounded bg-zinc-950 border border-zinc-900 text-zinc-400 shrink-0">
                      {act.type === "ATTENDANCE" ? (
                        <CalendarCheck className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold text-white leading-snug">{act.title}</p>
                      <p className="text-zinc-500">{act.detail}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">{new Date(act.time).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}