"use strict";
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { searchMembers, addPayment } from "@/app/actions/admin";
import { Search, AlertTriangle, CreditCard, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";

type SearchResult = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  height: number;
  weight: number;
  nextDueDate: Date | null;
  status: "ACTIVE" | "OVERDUE";
};

export function AdminFeeManager() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
  
  // Payment Form States
  const [amount, setAmount] = useState("1200");
  const [duration, setDuration] = useState("1");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Auto pre-fill height and weight when user is selected
  useEffect(() => {
    if (selectedUser) {
      setHeight(selectedUser.height.toString());
      setWeight(selectedUser.weight.toString());
      setAmount((1200 * Number(duration)).toString());
    }
  }, [selectedUser]);

  // Recalculate amount if duration changes
  useEffect(() => {
    if (selectedUser) {
      setAmount((1200 * Number(duration)).toString());
    }
  }, [duration]);

  const handleSearch = () => {
    startTransition(async () => {
      const users = await searchMembers(query, "ALL");
      setResults(users as any);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() !== "") {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [query]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setToast(null);

    const amt = parseFloat(amount);
    const dur = parseInt(duration);
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(amt) || isNaN(dur) || isNaN(h) || isNaN(w) || amt <= 0 || dur <= 0 || h <= 0 || w <= 0) {
      setToast({ type: "error", message: "Please fill out all numeric inputs correctly" });
      return;
    }

    startTransition(async () => {
      const res = await addPayment(selectedUser.id, amt, dur, h, w);
      if (res.success) {
        setToast({ type: "success", message: res.message });
        setSelectedUser(null);
        setQuery("");
        setResults([]);
      } else {
        setToast({ type: "error", message: res.message || "Failed to add payment" });
      }
    });
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
            <AlertTriangle className="h-5 w-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {!selectedUser ? (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Search Member to Log Payment</h3>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search member by name..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          {query.trim() !== "" && (
            <div className="space-y-2 max-h-60 overflow-y-auto border border-zinc-900 rounded-lg p-2 bg-zinc-950/50">
              {isPending && results.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500">Searching...</div>
              ) : results.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500">No member found.</div>
              ) : (
                results.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-left transition-all"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{u.name}</p>
                      <p className="text-xs text-zinc-500">{u.email}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-600" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-5 rounded-xl border border-zinc-800 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
            <div>
              <p className="text-xs text-red-500 uppercase tracking-widest font-black">Register Payment For</p>
              <h4 className="text-base font-bold text-white mt-0.5">{selectedUser.name}</h4>
              <p className="text-xs text-zinc-400">{selectedUser.email}</p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-xs text-zinc-500 hover:text-white border border-zinc-850 px-2.5 py-1 rounded-md"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Duration (Months)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months (1 Year)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Amount Paid (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="Amount"
                  className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Member Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                  placeholder="Height"
                  className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Member Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  placeholder="Weight"
                  className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-950/20"
            >
              {isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Log Payment & Extend Due Date
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
