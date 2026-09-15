"use client";

import { useState, useCallback } from "react";
import { ProgressRecord, ProgressSummary, StepStatus } from "@/types";

export function useProgress(pathwayId: string = "pathway_bhopal_demo_01") {
  const [records, setRecords] = useState<Record<string, ProgressRecord>>({
    step_01: {
      pathwayId,
      stepId: "step_01",
      status: "IN_PROGRESS",
    },
  });
  const [loading, setLoading] = useState(false);

  const updateStep = useCallback(
    async (
      stepId: string,
      status: StepStatus,
      options?: {
        difficulty?: number;
        evidence?: { type: "github_url" | "deployed_url" | "screenshot" | "text"; value: string };
        notes?: string;
        blockedReason?: string;
      }
    ) => {
      setLoading(true);
      const newRecord: ProgressRecord = {
        pathwayId,
        stepId,
        status,
        difficulty: options?.difficulty,
        evidence: options?.evidence,
        notes: options?.notes,
        blockedReason: options?.blockedReason,
        completedAt: status === "COMPLETED" ? new Date().toISOString() : undefined,
      };

      setRecords((prev) => ({ ...prev, [stepId]: newRecord }));

      try {
        const res = await fetch(`/api/progress/${stepId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pathwayId,
            status,
            ...options,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          return {
            suggestReplan: data.suggestReplan,
            replanReason: data.replanReason,
          };
        }
      } catch {
        // Mock fallback
      } finally {
        setLoading(false);
      }

      const isBlocked = status === "BLOCKED";
      const isHighDiff = typeof options?.difficulty === "number" && options.difficulty >= 4;
      return {
        suggestReplan: isBlocked || isHighDiff,
        replanReason: isBlocked ? "Step marked as blocked" : undefined,
      };
    },
    [pathwayId]
  );

  return {
    records,
    loading,
    updateStep,
  };
}
