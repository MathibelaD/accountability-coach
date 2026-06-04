"use client";
import { useState, useEffect } from "react";

interface Photo {
  id: string;
  imageUrl: string;
  type: string;
  caption: string | null;
  uploadedAt: string;
  user: { name: string };
  challenge: { title: string };
}

export default function CommunityPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/photos?community=true")
      .then((r) => {
        if (!r.ok) return [];
        return r.json();
      })
      .then(setPhotos)
      .finally(() => setLoading(false));
  }, []);

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="space-y-5 stagger">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900">Community 🌱</h2>
        <p className="text-gray-500 text-sm mt-1">See how your challenge crew is progressing</p>
      </div>

      {loading ? (
        <div className="card text-center py-10">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-gray-500 font-medium">No shared progress yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Be the first! Share your progress from the Progress tab
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {photos.map((photo) => (
            <div key={photo.id} className="card">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-[#5f7a6a]/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-[#5f7a6a]">
                    {photo.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{photo.user.name}</p>
                  <p className="text-[11px] text-gray-400">
                    {photo.challenge.title} • {timeAgo(photo.uploadedAt)}
                  </p>
                </div>
                <span className="text-[10px] bg-[#c4a882]/15 text-[#8b6b47] px-2 py-0.5 rounded-full font-medium capitalize">
                  {photo.type}
                </span>
              </div>

              {/* Photo */}
              <img
                src={photo.imageUrl}
                alt={photo.caption || "Progress photo"}
                className="w-full rounded-xl object-cover max-h-96"
              />

              {/* Caption */}
              {photo.caption && (
                <p className="text-sm text-gray-700 mt-3">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
