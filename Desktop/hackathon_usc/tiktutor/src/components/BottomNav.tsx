"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Upload, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const items = [
    { href: "/feed", label: "Feed", Icon: Home },
    { href: "/explore", label: "Explore", Icon: Compass },
    { href: "/upload", label: "Upload", Icon: Upload },
    { href: "/profile", label: "Profile", Icon: User },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0">
      <nav className="mx-auto max-w-[520px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white px-3 py-2 flex items-center justify-between">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={
                "flex flex-col items-center gap-1 text-[11px] px-3 py-1 rounded-xl transition-transform " +
                (active
                  ? "text-[#FF6B00] drop-shadow-[0_0_16px_rgba(255,107,0,0.8)]"
                  : "text-white/80 hover:scale-[1.03]")
              }
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}



