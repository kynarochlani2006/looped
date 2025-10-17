"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Award, Brain, CalendarCheck, Flame, Sparkles, Trophy } from "lucide-react";

import { demoVideos } from "@/lib/videos";

export default function ProfilePage() {
  const saved = useMemo(() => demoVideos.slice(0, 4), []);

  const stats = [
    { label: "Clips Watched", value: 128, icon: PlayBadge },
    { label: "Daily Streak", value: 9, icon: Flame },
    { label: "Quiz Accuracy", value: "87%", icon: Brain },
    { label: "Minutes Saved", value: 214, icon: CalendarCheck },
  ];

  const badges = [
    { label: "Looped Founder", icon: Trophy, color: "#FF6B00" },
    { label: "Quiz Wizard", icon: Brain, color: "#7C3AED" },
    { label: "Retention Pro", icon: Award, color: "#22D3EE" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#0A0A0A] px-4 pb-20 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pt-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#FF6B00] to-[#7C3AED] text-2xl font-semibold">
              L
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Avery Johnson</h1>
              <p className="text-sm text-white/60">
                Building a knowledge loop in calculus, physics, and cognitive science.
              </p>
            </div>
          </div>
          <button className="self-start rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10 transition-colors">
            Edit profile
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }, index) => (
            <motion.div
              key={label}
              className="rounded-[24px] border border-white/10 bg-white/5 p-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">{label}</span>
                <Icon className="h-5 w-5 text-[#FF6B00]" />
              </div>
              <div className="mt-4 text-3xl font-semibold">{value}</div>
              <p className="mt-2 text-xs text-white/50">Vs. last week: +12%</p>
            </motion.div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_minmax(280px,1fr)]">
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.32em] text-white/70">
                Learning Journey
              </span>
              <span className="text-xs text-white/50">Updated today</span>
            </div>

            <div className="mt-6 space-y-6">
              {SCHEDULE.map((session, index) => (
                <motion.div
                  key={session.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/60">
                    {session.day}
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">{session.title}</h3>
                    <p className="text-xs text-white/60">{session.description}</p>
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

          <div className="flex flex-col gap-6">
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.32em] text-white/70">
                  Badge cabinet
                </span>
                <Sparkles className="h-5 w-5 text-[#FF6B00]" />
              </div>
              <div className="mt-6 flex flex-col gap-3">
                {badges.map(({ label, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ background: `${color}1A`, color }}
                    >
                      <Icon size={18} />
                    </div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
              <div className="text-sm uppercase tracking-[0.32em] text-white/70">Saved clips</div>
              <div className="mt-4 space-y-4">
                {saved.map((clip) => (
                  <div key={clip.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
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
                    <div className="flex-1 text-xs text-white/70">
                      <p className="text-sm font-medium text-white">{clip.title}</p>
                      <p>{clip.subject} • {clip.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const SCHEDULE = [
  {
    day: "Mon",
    title: "Calculus ladder: Chain rule sprint",
    description: "Watched 3 loops, completed quiz with 2/3 accuracy. Flagged implicit differentiation for review.",
    tags: ["Calculus", "Quiz"],
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

function PlayBadge() {
  return <Sparkles className="h-5 w-5 text-[#FF6B00]" />;
}

