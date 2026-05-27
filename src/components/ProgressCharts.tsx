"use strict";
"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Dumbbell, Scale, Activity } from "lucide-react";

type WeightLog = {
  id: string;
  weight: number;
  height: number;
  bmi: number;
  date: Date;
};

type PR = {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  date: Date;
};

export function ProgressCharts({
  weightLogs,
  personalRecords,
}: {
  weightLogs: WeightLog[];
  personalRecords: PR[];
}) {
  const [activeTab, setActiveTab] = useState<"WEIGHT" | "BMI" | "PR">("WEIGHT");

  const bodyData = weightLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString([], { month: "short", day: "numeric" }),
    weight: log.weight,
    bmi: log.bmi,
  }));

  const exercises = ["BENCH_PRESS", "SQUAT", "DEADLIFT", "SHOULDER_PRESS", "PULLUPS"];
  const [selectedExercise, setSelectedExercise] = useState("BENCH_PRESS");

  const prData = personalRecords
    .filter((pr) => pr.exercise === selectedExercise)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((pr) => ({
      date: new Date(pr.date).toLocaleDateString([], { month: "short", day: "numeric" }),
      weight: pr.weight,
      reps: pr.reps,
    }));

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-zinc-900 pb-2">
        <button
          onClick={() => setActiveTab("WEIGHT")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "WEIGHT"
              ? "bg-red-600 text-white"
              : "bg-zinc-950 text-zinc-400 hover:text-white"
          }`}
        >
          <Scale className="h-3.5 w-3.5" />
          Weight Progress
        </button>
        <button
          onClick={() => setActiveTab("BMI")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "BMI"
              ? "bg-red-600 text-white"
              : "bg-zinc-950 text-zinc-400 hover:text-white"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          BMI Progress
        </button>
        <button
          onClick={() => setActiveTab("PR")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === "PR"
              ? "bg-red-600 text-white"
              : "bg-zinc-950 text-zinc-400 hover:text-white"
          }`}
        >
          <Dumbbell className="h-3.5 w-3.5" />
          Lifting PRs
        </button>
      </div>

      <div className="h-72 w-full bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex flex-col justify-between">
        {activeTab === "WEIGHT" && (
          <>
            {bodyData.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-24">No weight entries recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bodyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
                  <YAxis stroke="#71717a" fontSize={10} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a" }}
                    labelStyle={{ color: "#a1a1aa", fontSize: 11 }}
                    itemStyle={{ color: "#ffffff", fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#ef4444" strokeWidth={2.5} name="Weight (kg)" dot={{ fill: "#ef4444" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </>
        )}

        {activeTab === "BMI" && (
          <>
            {bodyData.length === 0 ? (
              <p className="text-zinc-500 text-xs text-center py-24">No BMI entries recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bodyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={10} />
                  <YAxis stroke="#71717a" fontSize={10} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a" }}
                    labelStyle={{ color: "#a1a1aa", fontSize: 11 }}
                    itemStyle={{ color: "#ffffff", fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="bmi" stroke="#3b82f6" strokeWidth={2.5} name="BMI Index" dot={{ fill: "#3b82f6" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </>
        )}

        {activeTab === "PR" && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 border-b border-zinc-900/40">
              {exercises.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setSelectedExercise(ex)}
                  className={`px-3 py-1 rounded text-[10px] font-bold shrink-0 transition-all ${
                    selectedExercise === ex
                      ? "bg-zinc-850 text-white border border-red-900/30"
                      : "bg-transparent text-zinc-500 hover:text-white"
                  }`}
                >
                  {ex.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="flex-1 w-full">
              {prData.length === 0 ? (
                <p className="text-zinc-500 text-xs text-center py-16">No PR entries for {selectedExercise.replace("_", " ")}.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={9} />
                    <YAxis stroke="#71717a" fontSize={9} domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a" }}
                      labelStyle={{ color: "#a1a1aa", fontSize: 10 }}
                      itemStyle={{ color: "#ffffff", fontSize: 11 }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2.5} name="Lift Weight (kg)" dot={{ fill: "#10b981" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
