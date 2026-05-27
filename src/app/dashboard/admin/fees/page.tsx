import React from "react";
import { prisma } from "@/lib/prisma";
import { AdminFeeManager } from "@/components/AdminFeeManager";
import { AlertTriangle, Calendar, Phone } from "lucide-react";

export const revalidate = 0; // Disable caching to ensure live stats

export default async function AdminFeesPage() {
  const now = new Date();

  // Fetch users with their latest payment to calculate overdue status
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      payments: {
        orderBy: { nextDueDate: "desc" },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });

  const overdueMembers = users
    .filter((u) => {
      if (u.payments.length === 0) return true;
      return u.payments[0].nextDueDate < now;
    })
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      mobileNumber: u.mobileNumber,
      nextDueDate: u.payments.length > 0 ? u.payments[0].nextDueDate : null,
    }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider">Fee Management</h1>
        <p className="text-sm text-zinc-400">Process member payments, adjust durations, and view payment expirations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column: Form Registration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-zinc-850">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 font-black">Register Member Payment</h2>
            <AdminFeeManager />
          </div>
        </div>

        {/* Right Column: Overdue Members Checklist */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-zinc-850">
            <div className="flex items-center gap-2 text-red-500 mb-4">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              <h2 className="text-lg font-bold text-white uppercase tracking-wider font-black">Overdue Checklist</h2>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Below are the members whose memberships have expired or who have no recorded payments.
            </p>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {overdueMembers.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs border border-dashed border-zinc-900 rounded-lg">
                  No members are currently overdue. All memberships active!
                </div>
              ) : (
                overdueMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 flex flex-col gap-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-white truncate max-w-[150px]">{member.name}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-red-950/40 border border-red-900/30 text-red-400 text-[9px] font-black uppercase tracking-wider">
                        Overdue
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{member.email}</p>
                    <div className="text-[10px] text-zinc-400 flex justify-between items-center pt-1 mt-1 border-t border-zinc-900/60">
                      <span className="flex items-center gap-1 font-medium">
                        <Phone className="h-3 w-3 text-zinc-500" /> {member.mobileNumber}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-red-500">
                        <Calendar className="h-3 w-3" />
                        {member.nextDueDate ? new Date(member.nextDueDate).toLocaleDateString() : "No Dues"}
                      </span>
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
