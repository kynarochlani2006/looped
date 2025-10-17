"use client";

import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const STYLES = ["Explainer", "Whiteboard", "Animated", "Show & tell"];

export default function OnboardingPage() {
  const { preferredStyles, toggleStyle } = useAppStore();
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-xl border border-black/10 dark:border-white/10 rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Choose your learning style</h1>
        <p className="text-sm opacity-80">Pick a few — we’ll tailor the feed.</p>
        <div className="grid grid-cols-2 gap-2">
          {STYLES.map((label) => {
            const active = preferredStyles.includes(label);
            return (
              <button
                key={label}
                onClick={() => toggleStyle(label)}
                className={
                  "rounded-lg px-3 py-2 text-sm border transition-colors " +
                  (active
                    ? "border-foreground bg-foreground/10"
                    : "border-black/10 dark:border-white/10 hover:bg-foreground/5")
                }
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => router.push("/feed")}
            className="text-sm rounded-lg border border-black/10 dark:border-white/10 px-3 py-2"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}


