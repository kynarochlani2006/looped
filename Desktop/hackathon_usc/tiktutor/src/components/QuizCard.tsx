"use client";

import { useAppStore } from "@/lib/store";

type Props = {
  reelId: string;
};

export function QuizCard({ reelId }: Props) {
  const { reels, quizAnswers, answerQuiz, next } = useAppStore();
  const reel = reels.find((r) => r.id === reelId);
  if (!reel || !reel.quiz) return null;

  const answered = quizAnswers[reelId];

  return (
    <div className="p-4 bg-background/95 backdrop-blur border border-black/10 dark:border-white/10 rounded-xl">
      <p className="text-sm font-medium mb-3">{reel.quiz.prompt}</p>
      <div className="grid grid-cols-1 gap-2">
        {reel.quiz.choices.map((choice, idx) => {
          const isSelected = answered?.selectedIndex === idx;
          const isCorrect = answered?.correct && isSelected;
          const isWrong = answered && isSelected && !answered.correct;
          return (
            <button
              key={idx}
              disabled={!!answered}
              onClick={() => answerQuiz(reelId, idx)}
              className={
                "text-left rounded-lg px-3 py-2 text-sm border transition-colors " +
                (isCorrect
                  ? "border-green-500/50 bg-green-500/10"
                  : isWrong
                  ? "border-red-500/50 bg-red-500/10"
                  : "border-black/10 dark:border-white/10 hover:bg-foreground/5")
              }
            >
              {choice}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3 flex items-center justify-between">
          <span className={"text-xs " + (answered.correct ? "text-green-500" : "text-red-500")}>
            {answered.correct ? "Correct!" : "Not quite"}
          </span>
          <button onClick={next} className="text-xs underline opacity-80 hover:opacity-100">
            Next video
          </button>
        </div>
      )}
    </div>
  );
}


