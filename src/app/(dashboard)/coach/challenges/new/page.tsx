"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewChallengePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    tasks: [""],
  });

  function addTask() {
    setForm({ ...form, tasks: [...form.tasks, ""] });
  }

  function updateTask(index: number, value: string) {
    const tasks = [...form.tasks];
    tasks[index] = value;
    setForm({ ...form, tasks });
  }

  function removeTask(index: number) {
    setForm({ ...form, tasks: form.tasks.filter((_, i) => i !== index) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const tasks = form.tasks.filter((t) => t.trim());
    await fetch("/api/challenges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tasks }),
    });
    router.push("/coach");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Create Challenge</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Challenge Name"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input"
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input min-h-[80px]"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="input"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Daily Tasks</label>
          {form.tasks.map((task, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder={`Task ${i + 1}`}
                value={task}
                onChange={(e) => updateTask(i, e.target.value)}
                className="input flex-1"
              />
              {form.tasks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTask(i)}
                  className="px-3 text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addTask} className="text-sm text-[#5f7a6a] font-medium">
            + Add Task
          </button>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating..." : "Create Challenge"}
        </button>
      </form>
    </div>
  );
}
