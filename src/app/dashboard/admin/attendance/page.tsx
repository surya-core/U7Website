import React from "react";
import { AdminAttendanceTracker } from "@/components/AdminAttendanceTracker";

export default function AdminAttendancePage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">Attendance Console</h1>
        <p className="text-sm text-zinc-400">Perform entry and exit logging for members using their names.</p>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-2xl border border-zinc-850">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 font-black">Daily Check-ins</h2>
        <AdminAttendanceTracker />
      </div>
    </div>
  );
}
