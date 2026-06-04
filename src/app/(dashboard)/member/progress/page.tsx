"use client";
import { useState, useEffect } from "react";

export default function ProgressPage() {
  const [checkins, setCheckins] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/checkins").then((r) => r.json()).then(setCheckins);
  }, []);

  const weightData = checkins.filter((c) => c.weight).map((c) => ({
    date: new Date(c.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    weight: c.weight,
  }));

  const waistData = checkins.filter((c) => c.waistMeasurement).map((c) => ({
    date: new Date(c.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    waist: c.waistMeasurement,
  }));

  const latestWeight = weightData[0]?.weight;
  const firstWeight = weightData[weightData.length - 1]?.weight;
  const weightChange = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Your Progress 📊</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-indigo-600">{checkins.length}</p>
          <p className="text-xs text-gray-500">Total Check-ins</p>
        </div>
        <div className="card text-center">
          <p className={`text-2xl font-bold ${weightChange && parseFloat(weightChange) < 0 ? "text-green-600" : "text-gray-600"}`}>
            {weightChange ? `${parseFloat(weightChange) > 0 ? "+" : ""}${weightChange}kg` : "—"}
          </p>
          <p className="text-xs text-gray-500">Weight Change</p>
        </div>
      </div>

      {/* Weight History */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-3">Weight History</h3>
        {weightData.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No weight data yet</p>
        ) : (
          <div className="space-y-2">
            {weightData.slice(0, 10).map((d, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="text-sm text-gray-500">{d.date}</span>
                <span className="text-sm font-medium text-gray-900">{d.weight} kg</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Waist History */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-3">Waist Measurement</h3>
        {waistData.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No measurement data yet</p>
        ) : (
          <div className="space-y-2">
            {waistData.slice(0, 10).map((d, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-gray-50">
                <span className="text-sm text-gray-500">{d.date}</span>
                <span className="text-sm font-medium text-gray-900">{d.waist} cm</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Check-in History */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-3">Check-in History</h3>
        <div className="flex flex-wrap gap-1">
          {checkins.slice(0, 30).map((c, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center"
              title={new Date(c.date).toLocaleDateString()}
            >
              <span className="text-xs text-green-600">✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
