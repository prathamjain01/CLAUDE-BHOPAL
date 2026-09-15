"use client";

import { useState } from "react";
import Link from "next/link";

export default function SharePage() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 md:px-8 py-8 text-text-primary">
      {/* Top action header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-subtle">
        <Link href="/" className="text-text-muted hover:text-text-primary text-xs font-label-code flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Home</span>
        </Link>
        <button
          onClick={handleCopyLink}
          className="px-4 py-2 rounded-lg bg-primary-container text-surface-deep font-title-sm text-xs flex items-center gap-1.5 hover:bg-primary transition-all shadow-[0_0_16px_rgba(255,107,53,0.3)]"
        >
          <span className="material-symbols-outlined text-[16px]">share</span>
          <span>{copied ? "Link Copied! ✓" : "Share Pathway"}</span>
        </button>
      </div>

      {/* Printable / Shareable Card */}
      <div className="p-8 md:p-10 rounded-2xl bg-surface-raised border border-border-subtle shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="flex items-center justify-between pb-6 border-b border-border-subtle mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-surface-deep shadow-[0_0_16px_rgba(255,107,53,0.4)]">
              <span className="material-symbols-outlined text-[24px]">explore</span>
            </div>
            <div>
              <span className="font-title-sm text-text-primary block text-base">SkillCompass Summary</span>
              <span className="font-label-code text-text-muted text-xs">Learner ID: SC-8921 • Central India Cohort</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-orange-subtle-bg text-primary font-label-code text-xs border border-primary-container/30">
            Active Roadmap
          </span>
        </div>

        {/* Target Goal & Match */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded-xl bg-surface-container border border-border-subtle">
            <span className="font-label-caps text-text-muted block mb-1">Target Career Goal</span>
            <span className="font-title-sm text-text-primary">AI / Full-Stack Engineer</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container border border-border-subtle">
            <span className="font-label-caps text-text-muted block mb-1">Market Readiness</span>
            <span className="font-headline-md text-primary">68%</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container border border-border-subtle">
            <span className="font-label-caps text-text-muted block mb-1">Estimated Timeline</span>
            <span className="font-title-sm text-text-primary">4.5 Months (12 hrs/wk)</span>
          </div>
        </div>

        {/* Skills Delta: Current vs Missing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-xl bg-surface-container border border-border-subtle">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
              <h4 className="font-title-sm text-text-primary text-sm">Verified Foundation</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {["JavaScript ES6+", "TypeScript", "React 19", "HTML/CSS", "Git"].map((s) => (
                <span key={s} className="px-2.5 py-1 rounded bg-surface-container-high text-xs font-label-code text-text-secondary">
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface-container border border-border-subtle">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary-container text-[18px]">bolt</span>
              <h4 className="font-title-sm text-text-primary text-sm">Next Immediate Competencies</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {["System Design & Caching", "Redis Rate Limiting", "Docker Containers", "RAG Embeddings"].map((s) => (
                <span key={s} className="px-2.5 py-1 rounded bg-orange-subtle-bg border border-primary-container/30 text-xs font-label-code text-primary">
                  → {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mentor / Review Notes */}
        <div className="p-4 rounded-xl bg-surface-container border border-border-subtle">
          <span className="font-label-caps text-text-muted block mb-1">AI Coach Diagnostic Note</span>
          <p className="font-body-sm text-text-secondary text-xs">
            &ldquo;Candidate shows strong frontend JavaScript fundamentals (86%). Primary gap is distributed backend system design. Recommended immediate priority is completing the Rate Limiter API project spec.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
