"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Brain,
  Heart,
  MessageCircle,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import clsx from "clsx";
import type { FeedVideo } from "@/lib/api";

type Props = {
  video: FeedVideo;
  onQuiz?: (videoId: string) => void;
};

export function VideoCard({ video, onQuiz }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    element.muted = isMuted;
    const play = () => {
      element
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    // Autoplay on mount
    play();

    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    element.addEventListener("pause", onPause);
    element.addEventListener("play", onPlay);

    return () => {
      element.removeEventListener("pause", onPause);
      element.removeEventListener("play", onPlay);
    };
  }, [isMuted]);

  const createdLabel = useMemo(() => {
    const created = new Date(video.createdAt);
    if (Number.isNaN(created.getTime())) return "";
    return created.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }, [video.createdAt]);

  const notePoints = useMemo(() => {
    const points = (video.keyPoints && video.keyPoints.length > 0)
      ? video.keyPoints
      : [video.summary];
    return points.slice(0, 4);
  }, [video.keyPoints, video.summary]);

  return (
    <motion.div
      className="relative w-full h-[92vh] max-h-[860px] overflow-hidden rounded-[26px] bg-black shadow-[0_40px_100px_-40px_rgba(255,107,0,0.65)] border border-white/10"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 160, damping: 16 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <video
        ref={videoRef}
        src={video.filepath}
        className="absolute inset-0 h-full w-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onClick={() => {
          const element = videoRef.current;
          if (!element) return;
          if (element.paused) {
            element.play().catch(() => setIsPlaying(false));
          } else {
            element.pause();
          }
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

      <div className="absolute left-5 right-20 bottom-6 text-white pointer-events-none select-none">
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em]"
          initial={{ x: -12, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          {video.topic}
          {video.duration ? (
            <span className="inline-flex items-center gap-1 opacity-80">
              <Play size={12} />
              {Math.round(video.duration)}s
            </span>
          ) : null}
        </motion.span>

        <motion.h3
          className="mt-3 text-3xl font-semibold tracking-tight leading-tight drop-shadow-[0_8px_22px_rgba(0,0,0,0.6)]"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="underline decoration-[#FF6B00] decoration-4 underline-offset-6">
            {video.title}
          </span>
        </motion.h3>

        <motion.p
          className="mt-3 max-w-xl text-sm/relaxed text-white/85"
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
        >
          {video.summary}
        </motion.p>

        <motion.div
          className={clsx(
            "mt-4 flex flex-wrap gap-2 transition-opacity",
            showNotes ? "opacity-100" : "opacity-70"
          )}
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
        >
          {notePoints.map((point, idx) => (
            <span
              key={idx}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs"
            >
              {point}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-6 right-5 flex flex-col items-center gap-3 text-white">
        <button
          onClick={() => setLiked((prev) => !prev)}
          className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-full border border-white/15 backdrop-blur transition-all",
            liked
              ? "bg-[#FF6B00] text-black shadow-[0_0_24px_rgba(255,107,0,0.8)]"
              : "bg-black/25 hover:bg-black/40"
          )}
        >
          <Heart size={20} fill={liked ? "currentColor" : "none"} />
        </button>
        <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/25 backdrop-blur hover:bg-black/40 transition-colors">
          <MessageCircle size={20} />
        </button>
        <button
          onClick={() => setSaved((prev) => !prev)}
          className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-full border border-white/15 backdrop-blur transition-all",
            saved
              ? "bg-[#FF6B00] text-black shadow-[0_0_24px_rgba(255,107,0,0.8)]"
              : "bg-black/25 hover:bg-black/40"
          )}
        >
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => onQuiz?.(video.id)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/20 text-[#FF6B00] backdrop-blur hover:bg-[#FF6B00]/25 transition-colors"
        >
          <Brain size={20} />
        </button>
      </div>

      <div className="absolute top-5 right-5 flex flex-col items-end gap-2 text-white">
        {createdLabel && (
          <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] tracking-wide uppercase">
            {createdLabel}
          </span>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 backdrop-blur hover:bg-black/50 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 backdrop-blur hover:bg-black/50 transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <motion.button
        className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/80 backdrop-blur transition-colors hover:text-white"
        onClick={() => setShowNotes((prev) => !prev)}
        whileTap={{ scale: 0.96 }}
      >
        {showNotes ? "Hide Notes" : "Key Notes"}
      </motion.button>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
          <div className="flex flex-col items-center gap-3 text-sm uppercase tracking-[0.32em]">
            <Play size={28} />
            Tap to Play
          </div>
        </div>
      )}

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: hovered
            ? "inset 0 0 140px rgba(255,107,0,0.28)"
            : "inset 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ type: "tween", duration: 0.4 }}
      />
    </motion.div>
  );
}
