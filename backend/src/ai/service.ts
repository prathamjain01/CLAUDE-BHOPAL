import { callClaude } from "./client.js";
import {
  buildPathwayGenerationPrompt,
  buildReplanPrompt,
  buildExplanationPrompt,
  LearnerContext,
  SkillGapContext,
  ResourceContext,
  ProjectContext,
  ReplanContext,
} from "./prompts.js";
import {
  PathwayResponse,
  PathwayResponseSchema,
  ReplanResponse,
  ReplanResponseSchema,
  ExplanationResponse,
  ExplanationResponseSchema,
  parseAndValidateJson,
} from "./schemas.js";

// ---------------------------------------------------------------------------
// AI Orchestration Service with Deterministic Fallbacks
// ---------------------------------------------------------------------------

export class AiService {
  /**
   * Generate an ordered learning pathway using Claude API with schema validation.
   * Falls back to deterministic generation if Claude API is unavailable or invalid.
   */
  async generatePathway(
    learner: LearnerContext,
    skillGap: SkillGapContext,
    resources: ResourceContext[],
    projects: ProjectContext[]
  ): Promise<PathwayResponse> {
    try {
      const { systemPrompt, userPrompt } = buildPathwayGenerationPrompt(
        learner,
        skillGap,
        resources,
        projects
      );

      const response = await callClaude({ systemPrompt, userPrompt });
      const validated = parseAndValidateJson(response.text, PathwayResponseSchema);

      // Business rule validation: ensure all referenced IDs exist in catalogues
      const validResourceIds = new Set(resources.map((r) => r.id));
      const validProjectIds = new Set(projects.map((p) => p.id));

      for (const step of validated.steps) {
        step.resourceIds = step.resourceIds.filter((id) => validResourceIds.has(id));
        if (step.projectId && !validProjectIds.has(step.projectId)) {
          step.projectId = null;
        }
      }

      return validated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[AI Service] Claude generation failed (${msg}). Using deterministic fallback.`);
      return this.generateDeterministicPathway(learner, skillGap, resources, projects);
    }
  }

  /**
   * Re-plan an existing pathway based on learner progress, difficulty, or constraints.
   */
  async replanPathway(
    currentPathway: {
      goal: string;
      steps: Array<{
        id: string;
        skillName: string;
        status: string;
        reason: string;
        estimatedDays: number;
      }>;
    },
    replanContext: ReplanContext,
    learner: LearnerContext,
    resources: ResourceContext[],
    projects: ProjectContext[]
  ): Promise<ReplanResponse> {
    try {
      const { systemPrompt, userPrompt } = buildReplanPrompt(
        currentPathway,
        replanContext,
        learner,
        resources,
        projects
      );

      const response = await callClaude({ systemPrompt, userPrompt });
      const validated = parseAndValidateJson(response.text, ReplanResponseSchema);

      return validated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[AI Service] Claude replan failed (${msg}). Using deterministic fallback.`);
      return this.generateDeterministicReplan(
        currentPathway,
        replanContext,
        learner,
        resources,
        projects
      );
    }
  }

  /**
   * Generate a beginner-friendly explanation of a skill.
   */
  async getExplanation(
    skillName: string,
    learnerContext: { preferredLanguage: string; currentSkills: string[] }
  ): Promise<ExplanationResponse> {
    try {
      const { systemPrompt, userPrompt } = buildExplanationPrompt(
        skillName,
        learnerContext
      );

      const response = await callClaude({ systemPrompt, userPrompt, maxTokens: 1024 });
      return parseAndValidateJson(response.text, ExplanationResponseSchema);
    } catch (err: unknown) {
      console.warn(`[AI Service] Explanation generation failed. Using default explanation.`);
      return {
        skillName,
        explanation: `${skillName} is an essential technology concept required to achieve your goal.`,
        realWorldAnalogy: "Think of it like learning the basic building blocks before constructing a house.",
        whyItMatters: `Mastering ${skillName} enables you to build functional, interactive projects independently.`,
        hindiExplanation: `${skillName} ek mahatvapurna skill hai jo aapke goal ke liye zaroori hai.`,
      };
    }
  }

  // -------------------------------------------------------------------------
  // Deterministic Fallbacks (Mandated by SRS FR-04 & Error Handling)
  // -------------------------------------------------------------------------

  /**
   * Generates a deterministic pathway sorted topologically by prerequisites.
   */
  generateDeterministicPathway(
    learner: LearnerContext,
    skillGap: SkillGapContext,
    resources: ResourceContext[],
    projects: ProjectContext[]
  ): PathwayResponse {
    const missing = skillGap.missingSkills.length > 0
      ? skillGap.missingSkills
      : skillGap.requiredSkills;

    // Topological sorting based on prerequisites
    const orderedSkills: string[] = [];
    const visited = new Set<string>();

    const visit = (skill: string) => {
      if (visited.has(skill)) return;
      const prereqs = skillGap.prerequisites[skill] || [];
      for (const prereq of prereqs) {
        if (missing.includes(prereq)) {
          visit(prereq);
        }
      }
      visited.add(skill);
      orderedSkills.push(skill);
    };

    for (const skill of missing) {
      visit(skill);
    }

    const steps = orderedSkills.map((skillName, idx) => {
      const stepNum = String(idx + 1).padStart(2, "0");
      const matchedResources = resources
        .filter((r) => r.skillId.toLowerCase() === skillName.toLowerCase() || r.title.toLowerCase().includes(skillName.toLowerCase()))
        .map((r) => r.id);

      const matchedProject = projects.find((p) =>
        p.skillIds.some((s) => s.toLowerCase() === skillName.toLowerCase())
      );

      // Estimate duration based on daily time (1 hr/day -> approx 7 days for standard skill)
      const dailyHours = Math.max(0.5, learner.dailyTimeMinutes / 60);
      const estDays = Math.max(3, Math.round(10 / dailyHours));

      return {
        id: `step_${stepNum}`,
        skillName,
        reason: idx === 0
          ? `Foundational starting skill required before progressing to advanced topics.`
          : `Direct prerequisite for subsequent milestones in ${learner.goal}.`,
        estimatedDays: estDays,
        resourceIds: matchedResources.length > 0 ? [matchedResources[0]] : [],
        projectId: matchedProject ? matchedProject.id : null,
        acceptanceCriteria: matchedProject
          ? matchedProject.acceptanceCriteria
          : [`Complete hands-on exercise demonstrating ${skillName}`, `Push code to GitHub`],
        beginnerTip: `Take notes and build small test snippets as you practice.`,
        status: idx === 0 ? ("IN_PROGRESS" as const) : ("NOT_STARTED" as const),
      };
    });

    const totalEstimatedDays = steps.reduce((sum, s) => sum + s.estimatedDays, 0);

    return {
      goal: learner.goal,
      totalEstimatedDays,
      steps: steps.length > 0 ? steps : [
        {
          id: "step_01",
          skillName: learner.goal,
          reason: "Core skill for your selected target goal.",
          estimatedDays: 14,
          resourceIds: resources.length > 0 ? [resources[0].id] : [],
          projectId: projects.length > 0 ? projects[0].id : null,
          acceptanceCriteria: ["Build sample project", "Document learning in notes"],
          beginnerTip: "Start with 30-45 minutes daily consistency.",
          status: "IN_PROGRESS" as const,
        },
      ],
    };
  }

  /**
   * Generates a deterministic replan response.
   */
  generateDeterministicReplan(
    currentPathway: {
      goal: string;
      steps: Array<{
        id: string;
        skillName: string;
        status: string;
        reason: string;
        estimatedDays: number;
      }>;
    },
    replanContext: ReplanContext,
    learner: LearnerContext,
    resources: ResourceContext[],
    projects: ProjectContext[]
  ): ReplanResponse {
    const updatedSteps = currentPathway.steps.map((step) => {
      if (step.id === replanContext.currentStepId) {
        if (replanContext.reason === "completed") {
          return { ...step, status: "COMPLETED" as const };
        } else if (replanContext.reason === "stuck") {
          return {
            ...step,
            status: "BLOCKED" as const,
            estimatedDays: step.estimatedDays + 3,
            beginnerTip: "Break down into smaller 15-minute concepts and review prerequisites.",
          };
        } else if (replanContext.reason === "need_more_practice") {
          return {
            ...step,
            status: "IN_PROGRESS" as const,
            estimatedDays: step.estimatedDays + 4,
            beginnerTip: "Practice building a mini clone before proceeding to the next step.",
          };
        }
      }
      return step;
    });

    let rationale = `Re-planned pathway based on: ${replanContext.reason}.`;
    if (replanContext.reason === "completed") {
      rationale = `Great job completing step ${replanContext.currentStepId}! Pathway updated to unlock subsequent steps.`;
    } else if (replanContext.reason === "stuck") {
      rationale = `Identified roadblock on step ${replanContext.currentStepId}. Added additional practice time and support tips.`;
    }

    const totalEstimatedDays = updatedSteps.reduce((sum, s) => sum + s.estimatedDays, 0);

    return {
      rationale,
      goal: currentPathway.goal,
      totalEstimatedDays,
      steps: updatedSteps.map((s) => ({
        id: s.id,
        skillName: s.skillName,
        reason: s.reason,
        estimatedDays: s.estimatedDays,
        resourceIds: [],
        projectId: null,
        acceptanceCriteria: ["Demonstrate mastery of core concepts"],
        beginnerTip: "Practice consistently each day.",
        status: (s.status as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED") || "NOT_STARTED",
      })),
    };
  }
}

export const aiService = new AiService();
