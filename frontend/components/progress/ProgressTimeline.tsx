"use client";

import React from "react";
import { PathwayStep, StepStatus } from "@/types";
import {
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  FileCheck,
} from "lucide-react";

interface ProgressTimelineProps {
  steps: PathwayStep[];
  onStepSelect?: (stepId: string) => void;
  selectedStepId?: string;
  onStatusChange?: (stepId: string, status: StepStatus) => void;
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  steps,
  onStepSelect,
  selectedStepId,
  onStatusChange,
}) => {
  const completedCount = steps.filter((s) => s.status === "COMPLETED").length;
  const percentage = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      {/* Progress Bar Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Journey Milestone Progress
          </h3>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            {completedCount} / {steps.length} Completed ({percentage}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
        {steps.map((step, idx) => {
          const isSelected = selectedStepId === step.id;
          const isCompleted = step.status === "COMPLETED";
          const isInProgress = step.status === "IN_PROGRESS";
          const isBlocked = step.status === "BLOCKED";

          return (
            <div
              key={step.id}
              className={`relative group transition-all ${
                isSelected ? "scale-[1.01]" : ""
              }`}
            >
              {/* Timeline Icon */}
              <div className="absolute -left-6 top-0.5 -translate-x-1/2 bg-white dark:bg-neutral-900 rounded-full">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                ) : isInProgress ? (
                  <PlayCircle className="w-5 h-5 text-blue-500 animate-pulse fill-blue-500/10" />
                ) : isBlocked ? (
                  <AlertCircle className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                ) : (
                  <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-600" />
                )}
              </div>

              {/* Step Summary Card */}
              <div
                onClick={() => onStepSelect?.(step.id)}
                className={`cursor-pointer rounded-xl p-4 border transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm"
                    : isInProgress
                    ? "border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400">
                      Step {step.order}
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {step.skillName}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {step.estimatedDays}d
                    </span>
                  </div>
                </div>

                {/* Expanded Details when selected */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700/60 text-xs space-y-3">
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {step.reason}
                    </p>

                    {step.acceptanceCriteria && step.acceptanceCriteria.length > 0 && (
                      <div>
                        <span className="font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                          Project Checkpoint:
                        </span>
                        <ul className="space-y-1 text-neutral-700 dark:text-neutral-300">
                          {step.acceptanceCriteria.map((c, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-500">✓</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {onStatusChange && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {step.status !== "IN_PROGRESS" && !isCompleted && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(step.id, "IN_PROGRESS");
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Mark as Current
                          </button>
                        )}
                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusChange(step.id, "COMPLETED");
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Complete Step
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
