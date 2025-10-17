"use client";

import { ReelItem } from "@/lib/store";
import { Play, Pause } from "lucide-react";
import { useState } from "react";

type Props = {
  item: ReelItem;
  isActive: boolean;
};

export function Reel({ item, isActive }: Props) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden text-white">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          {item.subtitle && (
            <p className="text-sm opacity-80 mt-1">{item.subtitle}</p>
          )}
        </div>
      </div>
      <button
        className="absolute bottom-3 right-3 rounded-full bg-white/10 backdrop-blur px-3 py-2 border border-white/20 text-xs flex items-center gap-1"
        onClick={() => setPaused((v) => !v)}
        aria-label={paused ? "Play" : "Pause"}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
        {paused ? "Play" : "Pause"}
      </button>
      {!isActive && (
        <div className="absolute inset-0 bg-black/30" aria-hidden />
      )}
    </div>
  );
}


