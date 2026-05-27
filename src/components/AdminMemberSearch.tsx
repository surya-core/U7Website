"use strict";
"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { searchMembers } from "@/app/actions/admin";
import { Search, ArrowRight, Calendar } from "lucide-react";

type Member = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  joiningDate: Date;
  status: "ACTIVE" | "OVERDUE";
  nextDueDate: Date | null;
};

export function AdminMemberSearch() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL, ACTIVE, OVERDUE
  const [members, setMembers] = useState<Member[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    startTransition(async () => {
      const results = await searchMembers(query, filter);
      setMembers(results as any);
    });
  };

  // Run search when query or filter changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        {/* Filter Selection */}
        <div className="flex gap-2">
          {["ALL", "ACTIVE", "OVERDUE"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                filter === f
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
            <span className="text-zinc-500 text-sm ml-2">Searching members...</span>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/20 rounded-xl border border-dashed border-zinc-850">
            <p className="text-zinc-500 text-sm">No members found matching the search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="glass-card p-4 rounded-xl border border-zinc-850 hover:border-red-600/30 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate max-w-[180px]">{member.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        member.status === "ACTIVE"
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                          : "bg-red-950/40 text-red-400 border border-red-900/30"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{member.email}</p>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" />
                    Due: {member.nextDueDate ? new Date(member.nextDueDate).toLocaleDateString() : "No Payments"}
                  </p>
                </div>

                <Link
                  href={`/dashboard/admin/members/${member.id}`}
                  className="p-2 rounded-lg bg-zinc-950 hover:bg-red-600 text-zinc-400 hover:text-white border border-zinc-900 hover:border-red-600 transition-all shrink-0"
                  title="View Profile"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
