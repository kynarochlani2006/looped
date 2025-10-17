"use client";

import { create } from "zustand";

export type ReelItem = {
  id: string;
  title: string;
  subtitle?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  quiz?: { prompt: string; choices: string[]; answerIndex: number } | null;
};

type AppState = {
  reels: ReelItem[];
  currentIndex: number;
  setIndex: (nextIndex: number) => void;
  next: () => void;
  prev: () => void;
  // preferences
  preferredStyles: string[];
  toggleStyle: (style: string) => void;
  // quiz state per reel id
  quizAnswers: Record<string, { selectedIndex: number; correct: boolean } | undefined>;
  answerQuiz: (reelId: string, selectedIndex: number) => void;
};

const mockReels: ReelItem[] = [
  {
    id: "1",
    title: "What is a Derivative?",
    subtitle: "Intuition with slopes",
    thumbnailUrl: "/window.svg",
    quiz: null,
  },
  {
    id: "2",
    title: "Chain Rule in 30s",
    subtitle: "Compose and differentiate",
    thumbnailUrl: "/globe.svg",
    quiz: {
      prompt: "d/dx of (3x^2) is?",
      choices: ["3x", "6x", "x^3", "9x^2"],
      answerIndex: 1,
    },
  },
  {
    id: "3",
    title: "Limits: Squeeze Theorem",
    subtitle: "Visual proof sketch",
    thumbnailUrl: "/file.svg",
    quiz: null,
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  reels: mockReels,
  currentIndex: 0,
  preferredStyles: [],
  quizAnswers: {},
  setIndex: (nextIndex: number) => {
    const { reels } = get();
    const clamped = Math.max(0, Math.min(nextIndex, reels.length - 1));
    set({ currentIndex: clamped });
  },
  next: () => {
    const { currentIndex } = get();
    get().setIndex(currentIndex + 1);
  },
  prev: () => {
    const { currentIndex } = get();
    get().setIndex(currentIndex - 1);
  },
  toggleStyle: (style: string) => {
    const current = get().preferredStyles;
    const exists = current.includes(style);
    const next = exists ? current.filter((s) => s !== style) : [...current, style];
    set({ preferredStyles: next });
  },
  answerQuiz: (reelId: string, selectedIndex: number) => {
    const reel = get().reels.find((r) => r.id === reelId);
    if (!reel || !reel.quiz) return;
    const correct = selectedIndex === reel.quiz.answerIndex;
    set((state) => ({
      quizAnswers: { ...state.quizAnswers, [reelId]: { selectedIndex, correct } },
    }));
  },
}));


