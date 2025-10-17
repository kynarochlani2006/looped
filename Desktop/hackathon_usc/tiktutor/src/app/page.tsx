"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const FEATURES = [
  {
    headline: "Upload a dense textbook PDF",
    body: "Looped parses each chapter, detects headings, and maps out the learning beats automatically.",
  },
  {
    headline: "AI drafts a 30-second script",
    body: "Educational tone, visual cues, and key callouts are generated so every clip can stand alone.",
  },
  {
    headline: "Render into a TikTok-ready reel",
    body: "Captions, overlays, and stock visuals blend into a vertical video ready for your studio feed.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-32 pt-16">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_minmax(300px,1fr)] lg:items-center">
          <div className="space-y-8">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Sparkles size={16} />
              Next-gen study studio
            </motion.span>
            <motion.h1
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Turn any textbook chapter into a cinematic learning loop — in minutes.
            </motion.h1>
            <motion.p
              className="max-w-2xl text-sm leading-relaxed text-white/70"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Looped ingests curriculum PDFs, outlines the core beats, drafts educational scripts,
              and renders vertical study reels your students will actually binge. Upload, review,
              and publish — all in one toolchain.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/50 bg-[#FF6B00]/20 px-5 py-3 text-xs uppercase tracking-[0.32em] text-[#FF6B00] hover:bg-[#FF6B00]/25 transition-colors"
              >
                Start generating
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.32em] text-white/70 hover:bg-white/10 transition-colors"
              >
                View feed
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="relative h-[520px] overflow-hidden rounded-[36px] border border-white/10 bg-white/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <video
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-3 text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em]">
                Generated clip
              </span>
              <h3 className="text-2xl font-semibold leading-tight">Derivatives: Intuition + Slopes</h3>
              <p className="text-xs text-white/70">
                Script, captions, overlays, and quiz context rendered automatically with Looped Studio.
              </p>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.headline}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.08 }}
            >
              <span className="text-xs uppercase tracking-[0.32em] text-white/60">
                Step {index + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {feature.headline}
              </h3>
              <p className="mt-2 text-sm text-white/70">{feature.body}</p>
            </motion.div>
          ))}
        </section>

        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-[#FF6B00]/10 p-8">
          <div className="grid gap-6 md:grid-cols-[1.2fr_minmax(280px,1fr)] md:items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Premium learning UX out of the box.
              </h2>
              <p className="text-sm text-white/70">
                Scroll-snapping reels, frosted glass overlays, streak mechanics, live quiz generation,
                and a modular pipeline ready for your production AI stack.
              </p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                <span className="rounded-full border border-white/10 px-3 py-1">
                  React + Tailwind + Framer Motion
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  Express + FastAPI + MongoDB
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1">
                  Deploy to Vercel & Render
                </span>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              <p>
                Every layer is modular. Swap in OpenAI, ElevenLabs, or custom LLMs in the FastAPI microservice,
                plug a real Mongo cluster into the Express backend, and the UI instantly reflects the richer data.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
