"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: "explore",
      match: pathname === "/",
    },
    {
      name: "Path",
      path: "/pathway",
      icon: "route",
      match: pathname.startsWith("/pathway") || pathname.startsWith("/onboarding"),
    },
    {
      name: "Progress",
      path: "/progress",
      icon: "insights",
      match: pathname.startsWith("/progress") || pathname.startsWith("/assessment"),
    },
    {
      name: "Work",
      path: "/work-map",
      icon: "terminal",
      match: pathname.startsWith("/work-map"),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface-deep/85 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.4)]"
      style={{
        backgroundColor: "rgba(8, 8, 8, 0.88)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="h-16 max-w-lg mx-auto px-4 grid grid-cols-4 items-center">
        {navItems.map((item) => {
          const isActive = item.match;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 h-12 rounded-lg transition-all ${
                isActive
                  ? "text-primary-container font-medium scale-105"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-container/40"
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${isActive ? "text-primary-container" : ""}`}>
                {item.icon}
              </span>
              <span className={`font-label-caps text-label-caps text-[10px] ${isActive ? "text-primary-container font-semibold" : "text-text-muted"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
