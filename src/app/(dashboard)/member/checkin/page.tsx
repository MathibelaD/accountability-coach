"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckinPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    notes: "",
    weight: "",
    waistMeasurement: "",
    waterIntake: "",
    tasks: [] as { taskId: string; name: string; completed: boolean }[],
  });

  useEffect(() => {
    fetch("/api/challenges")
      .then((r) => r.json())
      .then((data) => {
        setChallenges(data);
        if (data.length > 0 && data[0].tasks) {
          setForm((f) => ({
            ...f,
            tasks: data[0].tasks.map((t: any) => ({ taskId: t.id, name: t.name, completed: false })),
          }));
        }
      });
  }, []);

  function toggleTask(taskId: string) {
    setForm({
      ...form,
      tasks: form.tasks.map((t) => (t.taskId === taskId ? { ...t, completed: !t.completed } : t)),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!challenges[0]) return;
    setLoading(true);

    await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeId: challenges[0].id,
        notes: form.notes || null,
        weight: form.weight ? parseFloat(form.weight) : null,
        waistMeasurement: form.waistMeasurement ? parseFloat(form.waistMeasurement) : null,
        waterIntake: form.waterIntake ? parseFloat(form.waterIntake) : null,
        tasks: form.tasks.map((t) => ({ taskId: t.taskId, completed: t.completed })),
      }),
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push("/member");
      router.refresh();
    }, 1500);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-xl font-bold text-gray-900">Check-In Complete!</h2>
        <p className="text-gray-500 mt-1">You&apos;re crushing it! Keep going!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Daily Check-In ✅</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tasks */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-gray-700">Today&apos;s Tasks</h3>
          {form.tasks.map((task) => (
            <button
              key={task.taskId}
              type="button"
              onClick={() => toggleTask(task.taskId)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                task.completed ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-100"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                  task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                }`}
              >
                {task.completed ? "✓" : ""}
              </span>
              <span className={`text-sm ${task.completed ? "text-green-700" : "text-gray-600"}`}>
                {task.name}
              </span>
            </button>
          ))}
        </div>

        {/* Measurements */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-gray-700">Measurements (optional)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="input"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Waist (cm)</label>
              <input
                type="number"
                step="0.1"
                value={form.waistMeasurement}
                onChange={(e) => setForm({ ...form, waistMeasurement: e.target.value })}
                className="input"
                placeholder="0.0"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Water Intake (L)</label>
            <input
              type="number"
              step="0.1"
              value={form.waterIntake}
              onChange={(e) => setForm({ ...form, waterIntake: e.target.value })}
              className="input"
              placeholder="0.0"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <label className="text-xs text-gray-500 mb-1 block">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="input min-h-[60px]"
            placeholder="How are you feeling today?"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full text-lg">
          {loading ? "Saving..." : "✅ Complete Check-In"}
        </button>
      </form>
    </div>
  );
}
