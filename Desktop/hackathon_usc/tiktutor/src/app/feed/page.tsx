"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2, RefreshCcw } from "lucide-react";

import { VideoCard } from "@/components/VideoCard";
import { QuizDrawer } from "@/components/QuizDrawer";
import { fetchFeed, fetchQuiz, type FeedVideo, type QuizPayload } from "@/lib/api";

export default function FeedPage() {
  const [videos, setVideos] = useState<FeedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string>("All");
  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [isQuizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeed();
      setVideos(data);
    } catch (err) {
      console.error(err);
      setError("We couldn’t fetch the feed. Try again in a bit.");
    } finally {
      setLoading(false);
    }
  };

  const topics = useMemo(() => {
    const unique = new Set<string>();
    videos.forEach((video) => unique.add(video.topic));
    return ["All", ...Array.from(unique)];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    if (activeTopic === "All") return videos;
    return videos.filter((video) => video.topic === activeTopic);
  }, [videos, activeTopic]);

  const handleQuiz = async (videoId: string) => {
    setQuizLoading(true);
    try {
      const payload = await fetchQuiz(videoId);
      setQuiz(payload);
    } catch (err) {
      console.error(err);
      setQuiz({
        videoId,
        questions: [
          {
            prompt: "We couldn’t reach the quiz service. Try again?",
            choices: ["Retry", "Cancel", "Refresh feed"],
            answerIndex: 0,
          },
        ],
      });
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[#0A0A0A] pb-28 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Personalized Study Feed
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Swipe through AI-crafted micro lessons tuned to what you’re learning today.
            </p>
          </div>
          <button
            onClick={loadFeed}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/80 hover:bg-white/10 transition-colors"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => {
            const active = topic === activeTopic;
            return (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={
                  "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition-all " +
                  (active
                    ? "border-[#FF6B00]/80 bg-[#FF6B00]/20 text-[#FF6B00]"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white")
                }
              >
                {topic}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-4 flex w-full justify-center px-3">
        <div className="relative flex h-[82vh] w-full max-w-[520px] snap-y snap-mandatory flex-col gap-6 overflow-y-auto pb-10">
          {loading && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/70">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading study clips…
            </div>
          )}

          {!loading && error && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-sm text-red-400">
              <p>{error}</p>
              <button
                onClick={loadFeed}
                className="rounded-full border border-red-400/50 px-4 py-2 text-xs uppercase tracking-[0.3em] hover:bg-red-400/10"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredVideos.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-sm text-white/70">
              No clips in this topic yet. Try another filter or upload new material to generate ones instantly.
            </div>
          )}

          {!loading &&
            !error &&
            filteredVideos.map((video) => (
              <div key={video.id} className="snap-start">
                <VideoCard video={video} onQuiz={handleQuiz} />
              </div>
            ))}
        </div>
      </section>

      <AnimatePresence>
        {quiz && (
          <QuizDrawer
            quiz={quiz}
            onClose={() => setQuiz(null)}
            isLoading={isQuizLoading}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
