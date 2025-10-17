"use client";

import { useAppStore } from "@/lib/store";
import { Reel } from "./Reel";
import { QuizCard } from "./QuizCard";
import { useSwipeable } from "react-swipeable";
import { AnimatePresence, motion } from "framer-motion";

export function ReelsFeed() {
  const { reels, currentIndex, next, prev } = useAppStore();

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => next(),
    onSwipedDown: () => prev(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div
      {...swipeHandlers}
      className="relative w-full max-w-[420px] h-[80vh] mx-auto"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={reels[currentIndex]?.id}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="w-full h-full"
        >
          <div className="w-full h-full relative">
            <Reel item={reels[currentIndex]} isActive />
            {reels[currentIndex]?.quiz && (
              <div className="absolute bottom-4 left-4 right-4">
                <QuizCard reelId={reels[currentIndex].id} />
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-center justify-between px-2">
        <button
          onClick={prev}
          className="pointer-events-auto rounded-full bg-background/70 border border-black/10 dark:border-white/10 px-3 py-1 text-xs"
        >
          Prev
        </button>
        <button
          onClick={next}
          className="pointer-events-auto rounded-full bg-background/70 border border-black/10 dark:border-white/10 px-3 py-1 text-xs"
        >
          Next
        </button>
      </div>
    </div>
  );
}


