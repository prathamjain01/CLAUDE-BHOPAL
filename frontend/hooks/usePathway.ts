"use client";

import { useState, useEffect, useCallback } from "react";
import { LearningPathway, PathwayStep, StepStatus, ReplanRequest } from "@/types";
import mockPathwayData from "@/mocks/mockPathway.json";

export function usePathway(pathwayId?: string) {
  const [pathway, setPathway] = useState<LearningPathway | null>(mockPathwayData as unknown as LearningPathway);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPathway = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pathways/${id}`);
      if (!res.ok) throw new Error("Failed to fetch pathway");
      const json = await res.json();
      if (json.data) {
        setPathway(json.data);
      }
    } catch {
      // Graceful fallback to mock pathway for mock-first frontend development
      setPathway(mockPathwayData as unknown as LearningPathway);
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePathway = useCallback(async (learnerProfile: unknown) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pathways/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(learnerProfile),
      });
      if (!res.ok) throw new Error("Pathway generation failed");
      const json = await res.json();
      if (json.data) {
        setPathway(json.data);
        return json.data;
      }
    } catch {
      // Fallback
      setPathway(mockPathwayData as unknown as LearningPathway);
      return mockPathwayData;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStepStatus = useCallback((stepId: string, newStatus: StepStatus) => {
    setPathway((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        steps: prev.steps.map((s) => (s.id === stepId ? { ...s, status: newStatus } : s)),
      };
    });
  }, []);

  const replan = useCallback(
    async (request: ReplanRequest) => {
      if (!pathway) return null;
      setLoading(true);
      try {
        const res = await fetch(`/api/pathways/${pathway._id}/replan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });
        if (!res.ok) throw new Error("Replan failed");
        const json = await res.json();
        if (json.data) {
          setPathway(json.data);
          return json.data;
        }
      } catch {
        // Local simulation fallback
        const updatedSteps = pathway.steps.map((s) => {
          if (s.id === request.stepId) {
            if (request.reason === "completed") {
              return { ...s, status: "COMPLETED" as StepStatus };
            } else if (request.reason === "stuck") {
              return { ...s, status: "BLOCKED" as StepStatus, estimatedDays: s.estimatedDays + 3 };
            }
          }
          return s;
        });
        const updated = {
          ...pathway,
          version: pathway.version + 1,
          steps: updatedSteps,
        };
        setPathway(updated);
        return {
          rationale: `Adapted pathway for "${request.reason}". Adjusted workload and checkpoints.`,
        };
      } finally {
        setLoading(false);
      }
    },
    [pathway]
  );

  useEffect(() => {
    if (pathwayId) {
      fetchPathway(pathwayId);
    }
  }, [pathwayId, fetchPathway]);

  return {
    pathway,
    loading,
    error,
    fetchPathway,
    generatePathway,
    updateStepStatus,
    replan,
  };
}
