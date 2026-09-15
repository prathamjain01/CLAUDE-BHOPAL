"use client";

import React from "react";
import { PathwayStep, StepStatus } from "@/types";
import {
  CheckCircle2,
  Clock,
  Code2,
  AlertCircle,
  PlayCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface PathStepProps {
  step: PathwayStep;
  isCurrent?: boolean;
  onStatusChange?: (stepId: string, newStatus: StepStatus) => void;
  onOpenReplan?: (stepId: string) => void;
}

export const PathStep: React.FC<PathStepProps> = ({
  step,
  isCurrent = false,
  onStatusChange,
  onOpenReplan,
}) => {
  const isCompleted = step.status === "COMPLETED";
  const isInProgress = step.status === "IN_PROGRESS";
  const isBlocked = step.status === "BLOCKED";

  const getStatusBadge = () => {
    switch (step.status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <PlayCircle className="w-3.5 h-3.5 animate-pulse" />
            In Progress
          </span>
        );
      case "BLOCKED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Needs Attention
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            Upcoming
          </span>
        );
    }
  };

  return (
    <div
      id={`step-card-${step.id}`}
      className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-200 bg-white dark:bg-neutral-900 border ${
        isInProgress || isCurrent
          ? "border-blue-500/50 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30"
          : isBlocked
          ? "border-amber-500/40 shadow-sm"
          : isCompleted
          ? "border-emerald-500/30 bg-emerald-500/[0.02]"
          : "border-neutral-200 dark:border-neutral-800"
      }`}
    >
      {/* Top Header: Step Indicator & Status */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
            Step {step.order}
          </span>
          {isCurrent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-blue-600 text-white">
              <Sparkles className="w-3 h-3" />
              Next Action
            </span>
          )}
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        {step.skillName}
      </h3>

      {/* Reason: Why this now? */}
      <div className="mb-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-3.5 border border-neutral-100 dark:border-neutral-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          Why this now?
        </h4>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {step.reason}
        </p>
      </div>

      {/* Beginner Tip if present */}
      {step.beginnerTip && (
        <div className="mb-4 text-xs bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-lg px-3 py-2 border border-amber-500/20 flex items-start gap-2">
          <span className="font-bold text-amber-600 dark:text-amber-400">Tip:</span>
          <span>{step.beginnerTip}</span>
        </div>
      )}

      {/* Metadata Row: Estimated Days & Project */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 mb-5">
        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5 text-neutral-500" />
          <span>Est. {step.estimatedDays} days (1 hr/day)</span>
        </div>
        {step.projectId && (
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
            <Code2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>Mini-Project Checkpoint Included</span>
          </div>
        )}
      </div>

      {/* Acceptance Criteria */}
      {step.acceptanceCriteria && step.acceptanceCriteria.length > 0 && (
        <div className="mb-5">
          <h5 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Verifiable Checkpoints:
          </h5>
          <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            {step.acceptanceCriteria.map((criterion, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isCompleted ? (
            <>
              {step.status !== "IN_PROGRESS" && (
                <button
                  id={`btn-start-${step.id}`}
                  onClick={() => onStatusChange?.(step.id, "IN_PROGRESS")}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
                >
                  Start This Step
                </button>
              )}
              <button
                id={`btn-complete-${step.id}`}
                onClick={() => onStatusChange?.(step.id, "COMPLETED")}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Complete
              </button>
            </>
          ) : (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Finished & Verified
            </span>
          )}
        </div>

        {/* Stuck or Re-plan Button */}
        {onOpenReplan && !isCompleted && (
          <button
            id={`btn-replan-${step.id}`}
            onClick={() => onOpenReplan(step.id)}
            className="text-xs font-medium text-neutral-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 underline underline-offset-2"
          >
            Stuck or want to adjust?
          </button>
        )}
      </div>
    </div>
  );
};
