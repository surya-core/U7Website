"use strict";
"use client";

import React, { useState } from "react";
import { Scale } from "lucide-react";

export function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [advice, setAdvice] = useState("");

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      alert("Please enter valid height and weight values");
      return;
    }

    const heightInMeters = h / 100;
    const bmiVal = w / (heightInMeters * heightInMeters);
    const roundedBmi = Math.round(bmiVal * 10) / 10;
    setBmi(roundedBmi);

    if (roundedBmi < 18.5) {
      setStatus("Underweight");
      setAdvice("Focus on a nutrient-rich diet and resistance training at U7 Gym to build lean muscle safely.");
    } else if (roundedBmi >= 18.5 && roundedBmi <= 24.9) {
      setStatus("Normal Weight");
      setAdvice("Great job! Keep maintaining your fitness with our strength and cardio programs.");
    } else if (roundedBmi >= 25 && roundedBmi <= 29.9) {
      setStatus("Overweight");
      setAdvice("Incorporate active cardio and structural strength routines. Let our trainers assist your fat loss journey.");
    } else {
      setStatus("Obese");
      setAdvice("Take control of your health. Start with gentle cardio, compound weight routines, and healthy food planning.");
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 max-w-xl mx-auto border border-zinc-800 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl" />
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-950/40 text-red-500 rounded-lg border border-red-900/30">
          <Scale className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Interactive BMI Calculator</h3>
          <p className="text-sm text-zinc-400">Instantly gauge your physical health status</p>
        </div>
      </div>

      <form onSubmit={calculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 175"
            required
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 70"
            required
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-lg transition-all"
        >
          Calculate My BMI
        </button>
      </form>

      {bmi !== null && (
        <div className="mt-6 pt-6 border-t border-zinc-800/80 animate-fadeIn">
          <div className="flex items-end justify-between mb-2">
            <span className="text-sm font-medium text-zinc-400">Calculated BMI</span>
            <span className="text-3xl font-black text-white">{bmi}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-zinc-400">Category:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                status === "Normal Weight"
                  ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                  : status === "Underweight"
                  ? "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                  : "bg-red-950/40 text-red-400 border border-red-900/30"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-900">
            <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-1">U7 Fitness Recommendation</p>
            <p className="text-sm text-zinc-300">{advice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
