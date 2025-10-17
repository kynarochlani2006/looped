"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles, X, XCircle } from "lucide-react";

import type { QuizPayload } from "@/lib/api";

type Props = {
  quiz: QuizPayload;
  onClose: () => void;
  isLoading?: boolean;
};

export function QuizDrawer({ quiz, onClose, isLoading = false }: Props) {
  const [selections, setSelections] = useState<Record<number, number>>({});

  useEffect(() => {
    setSelections({});
  }, [quiz.videoId]);

  const score = useMemo(() => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selections[index] === question.answerIndex) {
        correct += 1;
      }
    });
    return { correct, total: quiz.questions.length };
  }, [quiz, selections]);

  const allAnswered = useMemo(() => {
    return quiz.questions.every((_, idx) => selections[idx] !== undefined);
  }, [quiz.questions, selections]);

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-[90] mx-auto w-full max-w-[520px] px-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#090909]/95 text-white shadow-[0_-20px_90px_rgba(255,107,0,0.35)] backdrop-blur-xl">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.32em] text-white/70">
            <Sparkles size={16} />
            Active Recall Quiz
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/5 p-2 hover:bg-white/10 transition-colors"
            aria-label="Close quiz"
          >
            <X size={16} />
          </button>
        </header>

        <div className="space-y-6 px-5 py-5">
          {quiz.questions.map((question, questionIndex) => {
            const selected = selections[questionIndex];
            const isCorrect = selected === question.answerIndex;
            const isAnswered = selected !== undefined;

            return (
              <div
                key={questionIndex}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-white/90">
                    {question.prompt}
                  </p>
                  {isAnswered && (
                    <span
                      className={
                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.28em] " +
                        (isCorrect
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400")
                      }
                    >
                      {isCorrect ? "Correct" : "Review"}
                      {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    </span>
                  )}
                </div>

                <div className="mt-3 grid gap-2">
                  {question.choices.map((choice, choiceIndex) => {
                    const isSelected = selected === choiceIndex;
                    const correctChoice = question.answerIndex === choiceIndex;
                    const showState = isAnswered;
                    const baseStyle =
                      "rounded-xl border px-3 py-2 text-left text-sm transition-all";

                    let stateStyle =
                      "border-white/10 bg-white/5 hover:bg-white/8 text-white/85";
                    if (showState && isSelected) {
                      stateStyle = correctChoice
                        ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                        : "border-red-400/40 bg-red-500/15 text-red-200";
                    } else if (showState && correctChoice) {
                      stateStyle = "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";
                    }

                    return (
                      <button
                        key={choiceIndex}
                        onClick={() =>
                          setSelections((prev) => ({ ...prev, [questionIndex]: choiceIndex }))
                        }
                        className={`${baseStyle} ${stateStyle}`}
                        disabled={showState}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="flex items-center justify-between border-t border-white/10 bg-black/40 px-5 py-4 text-xs uppercase tracking-[0.28em] text-white/70">
          <div className="flex items-center gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles size={14} />}
            {isLoading ? "Generating…" : "Mastery Check"}
          </div>
          <div>
            {score.correct}/{score.total} mastered
          </div>
        </footer>

        <AnimatePresence>
          {allAnswered && (
            <motion.div
              className="border-t border-white/10 bg-[#FF6B00]/10 px-5 py-4 text-center text-xs uppercase tracking-[0.28em] text-[#FF6B00]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              Quiz complete — keep the streak alive!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
