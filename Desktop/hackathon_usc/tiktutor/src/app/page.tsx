/**
 * EXPLANATION MODE: Every code line has an adjacent explanation comment.
 * Annotated on 2025-10-17. No behavior changes intended.
 */
"use client";
// Marks this file as a client component so hooks and browser APIs are available.

// Imports Next.js Link for client-side navigation between routes without full reloads.
import Link from "next/link";
// Imports Framer Motion's motion factory for declarative animation wrappers.
import { motion } from "framer-motion";
// Imports arrow and sparkles icons from Lucide for visual embellishment.
import { ArrowRight, Sparkles } from "lucide-react";

// Defines the marketing feature data used to render the step-by-step cards.
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
// Ends the FEATURES array definition for reuse in the feature grid below.

// Declares and exports the landing page component rendered at the root route.
export default function LandingPage() {
  // Returns JSX describing the page structure and animations.
  return (
    // Acts as the full-screen backdrop using a dark theme with white text.
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] text-white">
      {/* Constrains content width, centers layout, and applies vertical spacing between sections. */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-32 pt-16">
        {/* Hero section pairing narrative copy with a video preview. */}
        <section className="grid gap-10 lg:grid-cols-[1.2fr_minmax(300px,1fr)] lg:items-center">
          {/* Left column containing headings, description, and CTAs. */}
          <div className="space-y-8">
            {/* Animated badge describing the product positioning. */}
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Sparkles icon reinforces the premium vibe of the badge. */}
              <Sparkles size={16} />
              {/* Badge label summarizing the product in a short phrase. */}
              Next-gen study studio
            </motion.span>
            {/* Animated hero headline that scales up on larger screens. */}
            <motion.h1
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Headline promising rapid conversion of textbooks into learning loops. */}
              Turn any textbook chapter into a cinematic learning loop — in minutes.
            </motion.h1>
            {/* Animated paragraph providing additional context about the workflow. */}
            <motion.p
              className="max-w-2xl text-sm leading-relaxed text-white/70"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Explains ingestion, outlining, scripting, and publishing steps handled by the platform. */}
              Looped ingests curriculum PDFs, outlines the core beats, drafts educational scripts,
              and renders vertical study reels your students will actually binge. Upload, review,
              and publish — all in one toolchain.
            </motion.p>

            {/* Animated container holding the primary and secondary call-to-action buttons. */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {/* Primary CTA directing users to the upload pipeline. */}
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 rounded-full border border-[#FF6B00]/50 bg-[#FF6B00]/20 px-5 py-3 text-xs uppercase tracking-[0.32em] text-[#FF6B00] hover:bg-[#FF6B00]/25 transition-colors"
              >
                {/* Button label encouraging users to start generating content. */}
                Start generating
                {/* Arrow icon illustrating forward progress. */}
                <ArrowRight size={16} />
              </Link>
              {/* Secondary CTA linking to the feed showcase. */}
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.32em] text-white/70 hover:bg-white/10 transition-colors"
              >
                {/* Button label inviting users to view existing output. */}
                View feed
                {/* Matching arrow icon for visual consistency. */}
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

          {/* Right column presenting an animated video mockup of generated output. */}
          <motion.div
            className="relative h-[520px] overflow-hidden rounded-[36px] border border-white/10 bg-white/5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Autoplaying looping video used to simulate the final reel experience. */}
            <video
              src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
            {/* Gradient overlay maintaining text legibility atop the video. */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            {/* Stack of captions labeling and describing the showcase clip. */}
            <div className="absolute bottom-6 left-6 right-6 space-y-3 text-white">
              {/* Chip marking the clip as generated rather than stock footage. */}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em]">
                Generated clip
              </span>
              {/* Title summarizing the math topic covered in the example reel. */}
              <h3 className="text-2xl font-semibold leading-tight">Derivatives: Intuition + Slopes</h3>
              {/* Supporting copy highlighting the automatically produced assets. */}
              <p className="text-xs text-white/70">
                Script, captions, overlays, and quiz context rendered automatically with Looped Studio.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Feature grid explaining the three major steps in the Looped workflow. */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Iterates through each feature to render an animated card with staggered timing. */}
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.headline}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.08 }}
            >
              {/* Displays the step number derived from the feature index. */}
              <span className="text-xs uppercase tracking-[0.32em] text-white/60">
                Step {index + 1}
              </span>
              {/* Shows the feature headline describing the action taken in that step. */}
              <h3 className="mt-3 text-lg font-semibold text-white">
                {feature.headline}
              </h3>
              {/* Presents the supporting detail for the corresponding feature step. */}
              <p className="mt-2 text-sm text-white/70">{feature.body}</p>
            </motion.div>
          ))}
        </section>

        {/* Closing section spotlighting platform extensibility and tech stack. */}
        <section className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-black/40 via-black/20 to-[#FF6B00]/10 p-8">
          {/* Responsive grid that pairs descriptive copy with a supportive text card. */}
          <div className="grid gap-6 md:grid-cols-[1.2fr_minmax(280px,1fr)] md:items-center">
            {/* Column explaining the out-of-the-box user experience and features. */}
            <div className="space-y-4">
              {/* Subheading summarizing the premium UX promise. */}
              <h2 className="text-2xl font-semibold tracking-tight">
                Premium learning UX out of the box.
              </h2>
              {/* Paragraph outlining interactive mechanics and modular pipeline support. */}
              <p className="text-sm text-white/70">
                Scroll-snapping reels, frosted glass overlays, streak mechanics, live quiz generation,
                and a modular pipeline ready for your production AI stack.
              </p>
              {/* Pill list highlighting major technology components and deployment targets. */}
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
            {/* Supporting card reinforcing the modular architecture message. */}
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
  // Ends the JSX returned by the LandingPage component.
}
// Closes the LandingPage function scope.
