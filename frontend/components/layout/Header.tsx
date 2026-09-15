"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname.startsWith("/onboarding")) return "Onboarding";
    if (pathname.startsWith("/pathway")) return "Path";
    if (pathname.startsWith("/progress")) return "Progress";
    if (pathname.startsWith("/work-map")) return "Work";
    if (pathname.startsWith("/assessment")) return "Assessment";
    return "Navigator";
  };

  return (
    <header
      className="fixed top-0 w-full z-50 pt-safe bg-surface-deep/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)]"
      style={{
        backgroundColor: "rgba(19, 19, 19, 0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="h-16 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-surface-deep shadow-[0_0_16px_rgba(255,107,53,0.4)] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px] font-bold">explore</span>
          </div>
          <div className="flex flex-col">
            <span className="font-title-sm text-title-sm font-semibold tracking-tight text-text-primary group-hover:text-primary transition-colors">
              SkillCompass
            </span>
            <span className="font-label-caps text-label-caps text-text-muted uppercase">
              {getPageTitle()}
            </span>
          </div>
        </Link>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowNotificationToast(!showNotificationToast)}
              aria-label="Notifications"
              className="w-10 h-10 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            </button>

            {showNotificationToast && (
              <div className="absolute right-0 mt-2 w-72 p-4 rounded-xl bg-surface-raised border border-border-subtle shadow-2xl backdrop-blur-xl z-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-title-sm text-xs text-text-primary">Notifications</span>
                  <span className="font-label-code text-[10px] text-primary">1 new</span>
                </div>
                <p className="font-body-sm text-xs text-text-secondary">
                  🎯 New recommendation: Check out the Distributed Rate Limiter API spec to close your System Design gap!
                </p>
              </div>
            )}
          </div>

          <Link
            href="/onboarding"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-border-subtle text-xs font-label-code text-text-primary hover:border-primary-container/40 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            <span>AI Plan</span>
          </Link>

          <div className="w-10 h-10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-border-subtle flex items-center justify-center text-xs font-bold text-primary ring-2 ring-primary-container/20">
              SC
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
