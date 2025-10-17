/**
 * EXPLANATION MODE: Every code line has an adjacent explanation comment.
 * Annotated on 2025-10-17. No behavior changes intended.
 */
// Enables client-side rendering so React hooks and browser APIs can be used here.
"use client";

// Imports useMemo to memoize derived values within the profile page.
import { useMemo } from "react";
// Imports Framer Motion for animating statistic and schedule cards.
import { motion } from "framer-motion";
// Imports icon components used throughout the stats and badge sections.
import { Award, Brain, CalendarCheck, Flame, Sparkles, Trophy } from "lucide-react";

// Imports demo video data to populate the saved clips list.
import { demoVideos } from "@/lib/videos";

// Exports the profile page component rendered at /profile.
export default function ProfilePage() {
  // Memoizes a subset of demo videos to show in the saved clips section.
  const saved = useMemo(() => demoVideos.slice(0, 4), []);

  // Defines statistics shown in the top grid, each with its own icon.
  const stats = [
    { label: "Clips Watched", value: 128, icon: PlayBadge }, // Shows the total number of clips consumed by the user.
    { label: "Daily Streak", value: 9, icon: Flame }, // Displays the current streak length using the flame icon.
    { label: "Quiz Accuracy", value: "87%", icon: Brain }, // Highlights quiz performance with the brain icon.
    { label: "Minutes Saved", value: 214, icon: CalendarCheck }, // Communicates productivity gains with a calendar icon.
  ];

  // Lists the earned badges along with their representative icons and colors.
  const badges = [
    { label: "Looped Founder", icon: Trophy, color: "#FF6B00" }, // Founder badge styled in orange.
    { label: "Quiz Wizard", icon: Brain, color: "#7C3AED" }, // Quiz badge with a purple accent.
    { label: "Retention Pro", icon: Award, color: "#22D3EE" }, // Retention badge shown in cyan.
  ];

  // Renders the profile page layout and UI modules.
  return (
    <>
      {/* Root layout container with dark background and page padding. */}
      <main className="min-h-screen w-full bg-[#0A0A0A] px-4 pb-20 text-white">
        {/* Centers the page content and spaces out the major sections. */}
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pt-10">
          {/* Header section displaying avatar, name, and edit button. */}
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Group showing the user avatar and bio. */}
            <div className="flex items-center gap-4">
              {/* Stylized avatar placeholder with gradient background and initial. */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#FF6B00] to-[#7C3AED] text-2xl font-semibold">
                L
              </div>
              {/* Textual user identity block. */}
              <div>
                {/* Displays the user's full name with prominent typography. */}
                <h1 className="text-3xl font-semibold tracking-tight">Avery Johnson</h1>
                {/* Shows a short bio describing current learning focus. */}
                <p className="text-sm text-white/60">
                  Building a knowledge loop in calculus, physics, and cognitive science.
                </p>
              </div>
            </div>
            {/* Button allowing the user to edit their profile settings. */}
            <button className="self-start rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10 transition-colors">
              Edit profile
            </button>
          </header>

          {/* Statistic cards summarizing user engagement metrics. */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* Maps each statistic definition into an animated card. */}
            {stats.map(({ label, value, icon: Icon }, index) => (
              <motion.div
                key={label}
                className="rounded-[24px] border border-white/10 bg-white/5 p-6"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                {/* Header row showing the stat label and its icon. */}
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/60">{label}</span>
                  <Icon className="h-5 w-5 text-[#FF6B00]" />
                </div>
                {/* Main statistic value rendered prominently. */}
                <div className="mt-4 text-3xl font-semibold">{value}</div>
                {/* Supplemental comparison text versus the previous week. */}
                <p className="mt-2 text-xs text-white/50">Vs. last week: +12%</p>
              </motion.div>
            ))}
          </section>

          {/* Layout combining the learning journey timeline and sidebar panels. */}
          <section className="grid gap-6 lg:grid-cols-[1.2fr_minmax(280px,1fr)]">
            {/* Learning journey card summarizing recent study sessions. */}
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
              {/* Card header indicating section label and freshness timestamp. */}
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.32em] text-white/70">
                  Learning Journey
                </span>
                <span className="text-xs text-white/50">Updated today</span>
              </div>

              {/* List of scheduled sessions rendered with motion animations. */}
              <div className="mt-6 space-y-6">
                {SCHEDULE.map((session, index) => (
                  <motion.div
                    key={session.title}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    {/* Badge showing the day associated with the learning session. */}
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/60">
                      {session.day}
                    </span>
                    {/* Session details including title, description, and tags. */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">{session.title}</h3>
                      <p className="text-xs text-white/60">{session.description}</p>
                      {/* Tag chips summarizing the session focus areas. */}
                      <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.28em] text-white/40">
                        {session.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-white/10 px-2 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar housing badges and saved clips. */}
            <div className="flex flex-col gap-6">
              {/* Badge cabinet card listing earned achievements. */}
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.32em] text-white/70">
                    Badge cabinet
                  </span>
                  <Sparkles className="h-5 w-5 text-[#FF6B00]" />
                </div>
                {/* Renders each badge entry with color-coded icon. */}
                <div className="mt-6 flex flex-col gap-3">
                  {badges.map(({ label, icon: Icon, color }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm"
                    >
                      {/* Circular icon container tinted to match the badge color. */}
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ background: `${color}1A`, color }}
                      >
                        <Icon size={18} />
                      </div>
                      {/* Badge label text describing the achievement. */}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved clips card showing recently bookmarked videos. */}
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
                <div className="text-sm uppercase tracking-[0.32em] text-white/70">Saved clips</div>
                {/* List of saved videos rendered with thumbnails and metadata. */}
                <div className="mt-4 space-y-4">
                  {saved.map((clip) => (
                    <div
                      key={clip.id}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-3"
                    >
                      {/* Thumbnail preview of the saved clip, autoplaying silently. */}
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl">
                        <video
                          src={clip.mp4Url}
                          className="h-full w-full object-cover"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                      </div>
                      {/* Textual details showing title, subject, and duration. */}
                      <div className="flex-1 text-xs text-white/70">
                        <p className="text-sm font-medium text-white">{clip.title}</p>
                        <p>
                          {clip.subject} • {clip.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

// Defines the static learning schedule data used in the journey card.
const SCHEDULE = [
  {
    day: "Mon", // Indicates the session occurs on Monday.
    title: "Calculus ladder: Chain rule sprint", // Provides the session title for quick scanning.
    description: "Watched 3 loops, completed quiz with 2/3 accuracy. Flagged implicit differentiation for review.", // Summarizes the activities completed that day.
    tags: ["Calculus", "Quiz"], // Tags categorize the session for filtering and display.
  },
  {
    day: "Tue",
    title: "Physics: Momentum conservation",
    description: "Generated 2 clips from lecture slides, practiced problems in the workbook.",
    tags: ["Physics", "Generated"],
  },
  {
    day: "Wed",
    title: "Cognitive science study jam",
    description: "Revisited memory encoding framework. Shared clip with the study group.",
    tags: ["Memory", "Shared"],
  },
];

// Renders the sparkles icon used for the "Clips Watched" statistic.
function PlayBadge() {
  return <Sparkles className="h-5 w-5 text-[#FF6B00]" />;
}
