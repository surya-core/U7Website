"use strict";
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { searchMembers, recordAttendance } from "@/app/actions/admin";
import { Search, LogIn, LogOut, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

type SearchResult = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  status: "ACTIVE" | "OVERDUE";
};

// We will fetch today's check-in state for search results
type AttendanceState = {
  [userId: string]: {
    checkedIn: boolean;
    entryTime?: string;
    exitTime?: string;
  };
};

export function AdminAttendanceTracker() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [attendanceStates, setAttendanceStates] = useState<AttendanceState>({});
  const [isPending, startTransition] = useTransition();
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchMembers = () => {
    startTransition(async () => {
      const users = await searchMembers(query, "ALL");
      setResults(users as any);
      
      // Fetch today's check-in status for each returned user
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      // We will perform a client-side fetch or let actions resolve status.
      // Let's call our API route: `/api/admin/attendance-status?userIds=id1,id2`
      if (users.length > 0) {
        const ids = users.map((u) => u.id).join(",");
        try {
          const res = await fetch(`/api/admin/attendance-status?userIds=${ids}`);
          if (res.ok) {
            const data = await res.json();
            setAttendanceStates(data);
          }
        } catch (err) {
          console.error("Failed to fetch attendance statuses", err);
        }
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleAttendanceClick = async (userId: string) => {
    setActionUserId(userId);
    setToast(null);
    try {
      const res = await recordAttendance(userId);
      if (res.success) {
        setToast({ type: "success", message: res.message });
        // Refresh this single user's status by re-fetching
        const checkRes = await fetch(`/api/admin/attendance-status?userIds=${userId}`);
        if (checkRes.ok) {
          const data = await checkRes.json();
          setAttendanceStates((prev) => ({ ...prev, ...data }));
        }
      } else {
        setToast({ type: "error", message: res.message || "Failed to log attendance" });
      }
    } catch (err) {
      setToast({ type: "error", message: "Network error occurred" });
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-sm animate-fadeIn ${
            toast.type === "success"
              ? "bg-emerald-950/40 border border-emerald-900/30 text-emerald-400"
              : "bg-red-950/40 border border-red-900/30 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Lookup Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter member's name..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-650 transition-colors"
        />
      </div>

      {/* Member Results List */}
      <div className="space-y-3">
        {isPending && results.length === 0 ? (
          <div className="flex justify-center py-12">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
            <span className="text-zinc-500 text-sm ml-2">Searching members...</span>
          </div>
        ) : query.trim() === "" ? (
          <div className="text-center py-12 bg-zinc-900/10 rounded-xl border border-zinc-850 border-dashed">
            <p className="text-zinc-500 text-sm">Type a member's name above to manage their daily check-in.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/10 rounded-xl border border-zinc-850 border-dashed">
            <p className="text-zinc-500 text-sm">No member found matching "{query}"</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((member) => {
              const state = attendanceStates[member.id] || { checkedIn: false };
              const isLoading = actionUserId === member.id;

              return (
                <div
                  key={member.id}
                  className="glass-card p-4 rounded-xl border border-zinc-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate">{member.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
                          member.status === "ACTIVE"
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                            : "bg-red-950/40 text-red-400 border border-red-900/30"
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{member.email}</p>
                    <p className="text-xs text-zinc-500 truncate">Mobile: {member.mobileNumber}</p>
                    
                    {/* Log details if checked in */}
                    {state.entryTime && (
                      <div className="text-[10px] text-zinc-400 flex flex-wrap gap-x-3 pt-1">
                        <span>Check-In: {new Date(state.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {state.exitTime && (
                          <span>Check-Out: {new Date(state.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Attendance Action Button */}
                    <button
                      disabled={isLoading}
                      onClick={() => handleAttendanceClick(member.id)}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isLoading
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : state.checkedIn
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : state.checkedIn ? (
                        <>
                          <LogOut className="h-3.5 w-3.5" />
                          CHECK OUT (EXIT)
                        </>
                      ) : (
                        <>
                          <LogIn className="h-3.5 w-3.5" />
                          CHECK IN (ENTRY)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
