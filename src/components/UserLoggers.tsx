"use strict";
"use client";

import React, { useState, useTransition } from "react";
import { logPersonalRecord, logUserWeight } from "@/app/actions/user";
import { Dumbbell, Scale, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export function UserLoggers({ initialHeight, initialWeight }: { initialHeight: number; initialWeight: number }) {
  // PR states
  const [exercise, setExercise] = useState("BENCH_PRESS");
  const [prWeight, setPrWeight] = useState("");
  const [prReps, setPrReps] = useState("1");
  
  // Weight logs states
  const [weight, setWeight] = useState(initialWeight.toString());
  const [height, setHeight] = useState(initialHeight.toString());

  const [isPrPending, startPrTransition] = useTransition();
  const [isWPending, startWTransition] = useTransition();

  const [prToast, setPrToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [wToast, setWToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handlePrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrToast(null);

    const w = parseFloat(prWeight);
    const r = parseInt(prReps);

    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) {
      setPrToast({ type: "error", message: "Please enter valid lift metrics" });
      return;
    }

    startPrTransition(async () => {
      const res = await logPersonalRecord(exercise, w, r);
      if (res.success) {
        setPrToast({ type: "success", message: res.message });
        setPrWeight("");
      } else {
        setPrToast({ type: "error", message: res.message || "Failed to log PR" });
      }
    });
  };

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWToast(null);

    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setWToast({ type: "error", message: "Please enter valid dimensions" });
      return;
    }

    startWTransition(async () => {
      const res = await logUserWeight(w, h);
      if (res.success) {
        setWToast({ type: "success", message: res.message });
      } else {
        setWToast({ type: "error", message: res.message || "Failed to log weight" });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 1. PR Logger Form */}
      <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4">
        <div className="flex items-center gap-2 text-red-500 border-b border-zinc-900 pb-3 mb-2">
          <Dumbbell className="h-5 w-5" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Log Personal Record</h3>
        </div>

        {prToast && (
          <div
            className={`p-3.5 rounded-lg flex items-center gap-2.5 text-xs animate-fadeIn ${
              prToast.type === "success"
                ? "bg-emerald-950/40 border border-emerald-900/30 text-emerald-400"
                : "bg-red-950/40 border border-red-900/30 text-red-400"
            }`}
          >
            {prToast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{prToast.message}</span>
          </div>
        )}

        <form onSubmit={handlePrSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Select Lift / Exercise
            </label>
            <select
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600"
            >
              <option value="BENCH_PRESS">Bench Press</option>
              <option value="SQUAT">Back Squat</option>
              <option value="DEADLIFT">Deadlift</option>
              <option value="SHOULDER_PRESS">Overhead Press</option>
              <option value="PULLUPS">Weighted Pullups</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Weight Lifted (kg)
              </label>
              <input
                type="number"
                step="0.5"
                value={prWeight}
                onChange={(e) => setPrWeight(e.target.value)}
                required
                placeholder="e.g. 100"
                className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Repetitions
              </label>
              <input
                type="number"
                value={prReps}
                onChange={(e) => setPrReps(e.target.value)}
                required
                placeholder="e.g. 5"
                className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPrPending}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-950/20"
          >
            {isPrPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
            Submit Record
          </button>
        </form>
      </div>

      {/* 2. Weight Logger Form */}
      <div className="glass-card p-6 rounded-2xl border border-zinc-850 space-y-4">
        <div className="flex items-center gap-2 text-blue-500 border-b border-zinc-900 pb-3 mb-2">
          <Scale className="h-5 w-5" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Update Body Weight</h3>
        </div>

        {wToast && (
          <div
            className={`p-3.5 rounded-lg flex items-center gap-2.5 text-xs animate-fadeIn ${
              wToast.type === "success"
                ? "bg-emerald-950/40 border border-emerald-900/30 text-emerald-400"
                : "bg-red-950/40 border border-red-900/30 text-red-400"
            }`}
          >
            {wToast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{wToast.message}</span>
          </div>
        )}

        <form onSubmit={handleWeightSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-850 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isWPending}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 disabled:bg-zinc-850 text-zinc-300 hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 active:scale-98"
          >
            {isWPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
            Update Dimensions
          </button>
        </form>
      </div>
    </div>
  );
}
