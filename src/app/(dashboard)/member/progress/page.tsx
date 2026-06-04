"use client";
import { useState, useEffect } from "react";

interface Photo {
  id: string;
  imageUrl: string;
  type: string;
  caption: string | null;
  shared: boolean;
  uploadedAt: string;
}

export default function ProgressPage() {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ type: "update", caption: "", shared: false });

  useEffect(() => {
    fetch("/api/checkins").then((r) => r.ok ? r.json() : []).then(setCheckins);
    fetch("/api/photos").then((r) => r.ok ? r.json() : []).then(setPhotos);
  }, []);

  const beforePhotos = photos.filter((p) => p.type === "before");
  const afterPhotos = photos.filter((p) => p.type === "after");
  const updatePhotos = photos.filter((p) => p.type === "update");

  const weightData = checkins.filter((c) => c.weight).map((c) => ({
    date: new Date(c.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    weight: c.weight,
  }));

  const latestWeight = weightData[0]?.weight;
  const firstWeight = weightData[weightData.length - 1]?.weight;
  const weightChange = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : null;

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const imageUrl = reader.result as string;

      // Get active challenge
      const res = await fetch("/api/checkins");
      const data = await res.json();
      const challengeId = data[0]?.challengeId;
      if (!challengeId) {
        alert("No active challenge found");
        setUploading(false);
        return;
      }

      await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          challengeId,
          type: uploadForm.type,
          caption: uploadForm.caption,
          shared: uploadForm.shared,
        }),
      });

      // Refresh photos
      const updated = await fetch("/api/photos").then((r) => r.json());
      setPhotos(updated);
      setUploading(false);
      setShowUpload(false);
      setUploadForm({ type: "update", caption: "", shared: false });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-5 stagger">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">My Progress</h2>
          <p className="text-gray-500 text-sm mt-1">Track your transformation</p>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} className="btn-primary text-sm">
          📸 Add Photo
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="card space-y-3">
          <div className="flex gap-2">
            {(["before", "after", "update"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setUploadForm({ ...uploadForm, type: t })}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
                  uploadForm.type === t
                    ? "bg-[#5f7a6a] text-white"
                    : "bg-[#f4efe9] text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            placeholder="Caption (optional)"
            value={uploadForm.caption}
            onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
            className="input"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={uploadForm.shared}
              onChange={(e) => setUploadForm({ ...uploadForm, shared: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[#5f7a6a] focus:ring-[#5f7a6a]"
            />
            Share with challenge members
          </label>
          <label className={`btn-primary block text-center cursor-pointer ${uploading ? "opacity-50" : ""}`}>
            {uploading ? "Uploading..." : "Choose Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {/* Before & After Comparison */}
      {(beforePhotos.length > 0 || afterPhotos.length > 0) && (
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-3">Before & After</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 text-center">Before</p>
              {beforePhotos[0] ? (
                <img
                  src={beforePhotos[0].imageUrl}
                  alt="Before"
                  className="w-full aspect-[3/4] object-cover rounded-xl"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-[#f4efe9] rounded-xl flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No photo</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2 text-center">After</p>
              {afterPhotos[0] ? (
                <img
                  src={afterPhotos[0].imageUrl}
                  alt="After"
                  className="w-full aspect-[3/4] object-cover rounded-xl"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-[#f4efe9] rounded-xl flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No photo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="stat-card text-center">
          <p className="text-2xl font-extrabold text-[#5f7a6a]">{checkins.length}</p>
          <p className="text-xs text-gray-500">Total Check-ins</p>
        </div>
        <div className="stat-card text-center">
          <p className={`text-2xl font-extrabold ${weightChange && parseFloat(weightChange) < 0 ? "text-[#5f7a6a]" : "text-gray-600"}`}>
            {weightChange ? `${parseFloat(weightChange) > 0 ? "+" : ""}${weightChange}kg` : "—"}
          </p>
          <p className="text-xs text-gray-500">Weight Change</p>
        </div>
      </div>

      {/* Progress Photos Timeline */}
      {updatePhotos.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-3">Progress Updates</h3>
          <div className="grid grid-cols-3 gap-2">
            {updatePhotos.map((p) => (
              <div key={p.id} className="relative">
                <img
                  src={p.imageUrl}
                  alt={p.caption || "Progress"}
                  className="w-full aspect-square object-cover rounded-xl"
                />
                {p.shared && (
                  <span className="absolute top-1 right-1 bg-white/80 text-[10px] px-1.5 py-0.5 rounded-full">👥</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weight History */}
      <div className="card">
        <h3 className="font-bold text-gray-800 mb-3">Weight History</h3>
        {weightData.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No weight data yet</p>
        ) : (
          <div className="space-y-2">
            {weightData.slice(0, 10).map((d, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-[#e8ddd0]/40">
                <span className="text-sm text-gray-500">{d.date}</span>
                <span className="text-sm font-semibold text-gray-900">{d.weight} kg</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Check-in grid */}
      <div className="card">
        <h3 className="font-bold text-gray-800 mb-3">Check-in Streak</h3>
        <div className="flex flex-wrap gap-1.5">
          {checkins.slice(0, 30).map((c, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-lg bg-[#5f7a6a]/15 flex items-center justify-center"
              title={new Date(c.date).toLocaleDateString()}
            >
              <span className="text-xs text-[#5f7a6a]">✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
