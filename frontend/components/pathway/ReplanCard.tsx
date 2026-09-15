"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface ReplanCardProps {
  stepId: string;
  stepName: string;
  onReplanSubmit: (payload: {
    reason: "completed" | "need_more_practice" | "stuck" | "time_changed" | "goal_changed";
    details: string;
    stepId: string;
    newTime?: number;
  }) => Promise<{ rationale?: string }>;
  onClose?: () => void;
}

export const ReplanCard: React.FC<ReplanCardProps> = ({
  stepId,
  stepName,
  onReplanSubmit,
  onClose,
}) => {
  const [reason, setReason] = useState<
    "completed" | "need_more_practice" | "stuck" | "time_changed" | "goal_changed"
  >("stuck");
  const [details, setDetails] = useState("");
  const [newTime, setNewTime] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [resultRationale, setResultRationale] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await onReplanSubmit({
        reason,
        details,
        stepId,
        ...(reason === "time_changed" ? { newTime } : {}),
      });
      if (res?.rationale) {
        setResultRationale(res.rationale);
      }
    } catch (err) {
      console.error("Replan error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Adaptive Re-Plan
            </h3>
            <p className="text-xs text-neutral-500">Step: {stepName}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            Cancel
          </button>
        )}
      </div>

      {resultRationale ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-100">
            <div className="flex items-center gap-2 font-bold text-sm mb-1 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              Pathway Adapted by AI
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">{resultRationale}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
            >
              Continue with Updated Pathway
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              How is this step going?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  id: "stuck",
                  label: "I am stuck",
                  desc: "Concept feels too difficult or unfamiliar",
                  icon: AlertTriangle,
                },
                {
                  id: "need_more_practice",
                  label: "I need more practice",
                  desc: "Want extra mini-exercises first",
                  icon: HelpCircle,
                },
                {
                  id: "completed",
                  label: "Already completed",
                  desc: "I already know this skill well",
                  icon: CheckCircle,
                },
                {
                  id: "time_changed",
                  label: "My available time changed",
                  desc: "Need to adjust daily schedule",
                  icon: Clock,
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const selected = reason === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setReason(opt.id as typeof reason)}
                    className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                      selected
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-500"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon
                        className={`w-4 h-4 ${
                          selected ? "text-blue-600 dark:text-blue-400" : "text-neutral-400"
                        }`}
                      />
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 leading-tight">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {reason === "time_changed" && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                New daily available time:
              </label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              >
                <option value={30}>30 mins / day (Light)</option>
                <option value={60}>60 mins / day (Standard)</option>
                <option value={120}>2 hours / day (Intensive)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Tell us more (Optional):
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g., JavaScript loops are confusing, or I only have a mobile phone this week."
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Recalculating with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Adjust My Learning Path
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
