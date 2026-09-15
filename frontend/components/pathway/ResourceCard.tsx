"use client";

import React from "react";
import { Resource } from "@/types";
import { ExternalLink, Clock, Smartphone, CheckCircle, BookOpen } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <div
      id={`resource-card-${resource.id}`}
      className="rounded-xl p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {resource.provider}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
              {resource.title}
            </h4>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          100% Free
        </span>
      </div>

      {/* Metadata Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 my-3">
        <span className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
          <Clock className="w-3 h-3 text-neutral-400" />
          {resource.durationHours} hrs self-paced
        </span>
        <span className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded capitalize">
          {resource.level}
        </span>
        {resource.isMobileFriendly && (
          <span className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
            <Smartphone className="w-3 h-3 text-emerald-500" />
            Mobile-Friendly
          </span>
        )}
      </div>

      {/* External Link */}
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        <span>Open Free Learning Material</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
