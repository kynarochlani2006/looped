"use client";

import { motion } from "framer-motion";

export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_120%,rgba(255,107,0,0.15),transparent),radial-gradient(600px_600px_at_10%_10%,rgba(255,255,255,0.05),transparent)]" />

      {/* Glow blobs */}
      <motion.div
        initial={{ opacity: 0.4, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
        className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,107,0,0.35), rgba(255,107,0,0))" }}
      />
      <motion.div
        initial={{ opacity: 0.35, scale: 1 }}
        animate={{ opacity: 0.55, scale: 1.05 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", delay: 0.4 }}
        className="absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,107,0,0.25), rgba(255,107,0,0))" }}
      />
    </div>
  );
}



