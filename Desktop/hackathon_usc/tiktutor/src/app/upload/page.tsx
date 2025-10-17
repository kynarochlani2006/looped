"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, UploadCloud, Wand2 } from "lucide-react";

import { uploadPdf, type FeedVideo } from "@/lib/api";

type UploadState = "idle" | "uploading" | "processing" | "completed" | "error";

const PROGRESS_FRAMES = [
  "Reading chapters and parsing structure…",
  "Breaking content into learning beats…",
  "Drafting the 30-second voiceover script…",
  "Syncing captions and overlays…",
  "Almost there — final polish…",
];

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progressMessage, setProgressMessage] = useState("");
  const [generatedVideos, setGeneratedVideos] = useState<FeedVideo[]>([]);

  const runProgressTimeline = async () => {
    for (const message of PROGRESS_FRAMES) {
      setProgressMessage(message);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const handleFile = async (file: File) => {
    setUploadState("uploading");
    setGeneratedVideos([]);
    setProgressMessage("Uploading textbook…");
    try {
      setUploadState("processing");
      const timeline = runProgressTimeline();
      const response = await uploadPdf(file);
      await timeline;
      setGeneratedVideos(response.videos);
      setUploadState("completed");
    } catch (err) {
      console.error(err);
      setUploadState("error");
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#0A0A0A] px-4 pb-24 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pt-10">
        <header className="flex flex-col gap-3">
          <span className="inline-flex max-w-max items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-white/70">
            <Wand2 size={14} />
            Looped Studio
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">
            Transform dense textbooks into cinematic study reels.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-white/70">
            Drop in a PDF or slide deck — we’ll slice chapters into micro lessons,
            script the voiceover, and return vertical videos ready for your feed.
          </p>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.2fr_minmax(280px,1fr)]">
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            {uploadState === "completed" && generatedVideos.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-[#FF6B00]">
                  <CheckCircle2 size={18} />
                  Generation Complete
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {generatedVideos.map((video) => (
                    <GeneratedPreview key={video.id} video={video} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <SkeletonVideo />
                <SkeletonVideo delay={0.12} />
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <motion.div
              className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              onClick={() => inputRef.current?.click()}
              role="button"
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
                  <UploadCloud size={28} />
                </div>
                <div className="font-medium">
                  {fileName ? `Ready to remix: ${fileName}` : "Drag & drop course files"}
                </div>
                <p className="max-w-xs text-xs text-white/60">
                  PDFs, slides, lecture notes up to 50MB. We’ll auto-section, summarize, and stitch into formatted clips.
                </p>
                <button className="rounded-full border border-white/15 bg-[#FF6B00]/20 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#FF6B00] hover:bg-[#FF6B00]/25 transition-colors">
                  Browse Files
                </button>
              </div>
            </motion.div>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.ppt,.pptx"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setFileName(file.name);
                await handleFile(file);
              }}
            />

            <motion.div
              className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm leading-relaxed text-white/70"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="font-medium text-white">
                Status
              </p>
              <div className="mt-3 flex flex-col gap-2 text-xs uppercase tracking-[0.32em] text-white/60">
                <StatusRow label="Upload" active={uploadState !== "idle"} done={uploadState !== "idle" && uploadState !== "error"} />
                <StatusRow label="Parsing" active={uploadState === "processing" || uploadState === "completed"} done={uploadState === "completed"} />
                <StatusRow label="Rendering" active={uploadState === "completed"} done={uploadState === "completed"} />
              </div>
              {uploadState === "processing" && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {progressMessage || "Generating study clips…"}
                </div>
              )}
              {uploadState === "error" && (
                <div className="mt-4 rounded-xl border border-red-400/50 bg-red-500/15 px-3 py-2 text-xs uppercase tracking-[0.3em] text-red-300">
                  Upload failed — please try again.
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SkeletonVideo({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="relative h-[500px] w-full overflow-hidden rounded-[26px] border border-white/10 bg-white/5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,107,0,0.35),transparent,rgba(255,255,255,0.08))]"
        animate={{ opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      <div className="absolute bottom-6 left-6 right-20 space-y-4 text-white/70">
        <div className="h-8 w-48 rounded-full bg-white/10" />
        <div className="h-4 w-64 rounded-full bg-white/10" />
        <div className="h-4 w-40 rounded-full bg-white/10" />
      </div>
    </motion.div>
  );
}

function GeneratedPreview({ video }: { video: FeedVideo }) {
  return (
    <motion.div
      className="flex flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/5"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden">
        <video
          src={video.filepath}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 space-y-2 text-xs text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 uppercase tracking-[0.32em]">
            {video.topic}
          </span>
          <p className="text-sm font-medium leading-tight">
            {video.title}
          </p>
        </div>
      </div>
      <div className="space-y-2 border-t border-white/10 p-4 text-xs text-white/70">
        <p>{video.summary}</p>
        <div className="flex flex-wrap gap-2">
          {video.keyPoints.slice(0, 3).map((point, idx) => (
            <span key={idx} className="rounded-full border border-white/10 bg-white/8 px-2 py-1">
              {point}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StatusRow({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span>{label}</span>
      <span className="font-semibold text-white">
        {done ? "✓" : active ? "…" : "—"}
      </span>
    </div>
  );
}
