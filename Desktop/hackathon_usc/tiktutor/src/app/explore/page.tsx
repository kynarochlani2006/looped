"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

import { fetchFeed, type FeedVideo } from "@/lib/api";
import { demoVideos } from "@/lib/videos";

type ExploreVideo = FeedVideo & { creatorStyle?: string };

export default function ExplorePage() {
  const [videos, setVideos] = useState<ExploreVideo[]>([]);
  const [subject, setSubject] = useState<string>("All");
  const [style, setStyle] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const seeded: ExploreVideo[] = demoVideos.map((video) => ({
      id: `demo-${video.id}`,
      title: video.title,
      topic: video.subject,
      summary: `Creator style: ${video.creatorStyle}. Duration ${video.duration}.`,
      script: "",
      keyPoints: [],
      filepath: video.mp4Url || "",
      duration: parseDuration(video.duration),
      thumbnail: null,
      createdAt: new Date().toISOString(),
      creatorStyle: video.creatorStyle,
    }));
    setVideos(seeded);

    fetchFeed()
      .then((feed) => {
        setVideos((prev) => [
          ...feed.map((item) => ({ ...item, creatorStyle: "AI" })),
          ...prev,
        ]);
      })
      .catch((err) => {
        console.warn("Failed to load live feed for explore", err);
      });
  }, []);

  const subjects = useMemo(() => {
    const set = new Set<string>(["All"]);
    videos.forEach((video) => set.add(video.topic));
    return Array.from(set);
  }, [videos]);

  const styles = useMemo(() => {
    const set = new Set<string>(["All"]);
    videos.forEach((video) => {
      if (video.creatorStyle) set.add(video.creatorStyle);
    });
    return Array.from(set);
  }, [videos]);

  const filtered = useMemo(() => {
    return videos.filter((video) => {
      const matchesSubject = subject === "All" || video.topic === subject;
      const matchesStyle = style === "All" || video.creatorStyle === style;
      const matchesSearch =
        search.length === 0 ||
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.summary.toLowerCase().includes(search.toLowerCase());
      return matchesSubject && matchesStyle && matchesSearch;
    });
  }, [videos, subject, style, search]);

  return (
    <main className="min-h-screen w-full bg-[#0A0A0A] px-4 pb-28 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pt-10">
        <div className="flex flex-col gap-3">
          <span className="inline-flex max-w-max items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-white/70">
            <Sparkles size={14} />
            Library
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">
            Browse Looped community reels & creator decks.
          </h1>
          <p className="text-sm text-white/70">
            Filter by subject, creator style, or search for a concept you want to review fast.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search derivatives, revolutions, supply & demand…"
              className="w-full rounded-xl border border-white/15 bg-black/30 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[#FF6B00] focus:outline-none"
            />
          </div>
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          >
            {subjects.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <select
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          >
            {styles.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video, index) => (
            <motion.div
              key={video.id + index}
              className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="relative aspect-[9/16] overflow-hidden">
                <video
                  src={video.filepath}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em]">
                    {video.topic}
                  </span>
                  {video.creatorStyle && (
                    <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/70">
                      {video.creatorStyle}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 space-y-2 text-white">
                  <h3 className="text-lg font-semibold leading-tight">
                    {video.title}
                  </h3>
                  <p className="text-xs text-white/80">{video.summary}</p>
                </div>
              </div>
              <div className="space-y-3 border-t border-white/10 p-4 text-xs text-white/70">
                <div className="flex flex-wrap gap-2">
                  {video.keyPoints.slice(0, 3).map((point, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-white/10 bg-white/8 px-2 py-1"
                    >
                      {point || "Concept highlight"}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em]">
                  <span>{video.duration ? `${Math.round(video.duration)}s` : "Quick"}</span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

function parseDuration(duration: string): number {
  if (!duration) return 30;
  const [minutesPart, secondsPart] = duration.split(":").map((part) => Number(part));
  if (Number.isNaN(minutesPart) || Number.isNaN(secondsPart)) return 30;
  return minutesPart * 60 + secondsPart;
}


