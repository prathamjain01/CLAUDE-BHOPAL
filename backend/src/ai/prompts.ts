// ---------------------------------------------------------------------------
// AI Prompt Templates
// ---------------------------------------------------------------------------
// Every prompt enforces:
//   1. Output MUST be valid JSON (no markdown fences, no preamble).
//   2. Claude MUST only reference resource/project IDs provided in context.
//   3. Claude MUST NOT invent URLs or make employment guarantees.
//   4. Claude MUST explain "why this step now" for every step.
// ---------------------------------------------------------------------------

export interface LearnerContext {
  goal: string;
  currentSkills: string[];
  device: string;
  dailyTimeMinutes: number;
  internetQuality: string;
  preferredLanguage: string;
  city: string;
  priorExposure?: string;
}

export interface SkillGapContext {
  knownSkills: string[];
  requiredSkills: string[];
  missingSkills: string[];
  prerequisites: Record<string, string[]>;
}

export interface ResourceContext {
  id: string;
  title: string;
  provider: string;
  skillId: string;
  level: string;
  durationHours: number;
  language: string;
  isMobileFriendly: boolean;
  url: string;
}

export interface ProjectContext {
  id: string;
  title: string;
  skillIds: string[];
  difficulty: string;
  acceptanceCriteria: string[];
}

export function buildPathwayGenerationPrompt(
  learner: LearnerContext,
  skillGap: SkillGapContext,
  resources: ResourceContext[],
  projects: ProjectContext[]
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are PathPilot, an AI learning-path advisor for self-directed learners in Tier-2 Indian cities (such as Bhopal and Indore).

RULES — you MUST follow every rule strictly:
1. Output ONLY valid JSON. Do NOT wrap output in markdown code blocks (\`\`\`json). No text outside JSON.
2. Use ONLY resource IDs and project IDs from the RESOURCE CATALOGUE and PROJECT CATALOGUE provided in the user prompt.
3. NEVER invent a URL, resource, or project.
4. NEVER promise or guarantee employment or job placement.
5. Every step MUST include a "reason" explaining why this skill is needed right now in sequence.
6. Order steps strictly so prerequisites come before dependent skills.
7. Respect the learner's device (e.g. mobile vs laptop), daily time, internet quality, and language constraints.
8. Keep explanations beginner-friendly in plain language.
9. Estimate days per step realistically based on learner's daily available time.

OUTPUT SCHEMA (exact structure):
{
  "goal": "<learner goal>",
  "totalEstimatedDays": <number>,
  "steps": [
    {
      "id": "step_<01|02|...>",
      "skillName": "<skill name>",
      "reason": "<clear explanation of why this step now>",
      "estimatedDays": <number>,
      "resourceIds": ["<id from catalogue>"],
      "projectId": "<id from catalogue or null>",
      "acceptanceCriteria": ["<criterion 1>", "<criterion 2>"],
      "beginnerTip": "<plain-language beginner advice>"
    }
  ]
}`;

  const userPrompt = `LEARNER PROFILE:
- Goal: ${learner.goal}
- Current skills: ${learner.currentSkills.join(", ") || "none"}
- Device: ${learner.device}
- Daily time: ${learner.dailyTimeMinutes} minutes/day
- Internet: ${learner.internetQuality}
- Language: ${learner.preferredLanguage}
- City: ${learner.city}
${learner.priorExposure ? `- Prior exposure: ${learner.priorExposure}` : ""}

SKILL GAP ANALYSIS:
- Known skills: ${learner.currentSkills.join(", ") || "none"}
- Required skills: ${skillGap.requiredSkills.join(", ")}
- Missing skills to learn: ${skillGap.missingSkills.join(", ")}
- Prerequisites graph: ${JSON.stringify(skillGap.prerequisites)}

RESOURCE CATALOGUE (use ONLY these IDs):
${JSON.stringify(resources, null, 2)}

PROJECT CATALOGUE (use ONLY these IDs):
${JSON.stringify(projects, null, 2)}

Generate the ordered learning pathway. Output strictly valid JSON.`;

  return { systemPrompt, userPrompt };
}

export interface ReplanContext {
  reason: "completed" | "need_more_practice" | "stuck" | "time_changed" | "goal_changed";
  details: string;
  currentStepId: string;
  updatedConstraints?: Partial<LearnerContext>;
}

export function buildReplanPrompt(
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
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are PathPilot, an AI learning-path advisor.
The learner is requesting a re-plan of their existing learning pathway.

RULES:
1. Output ONLY valid JSON. No markdown fences.
2. Use ONLY resource/project IDs from the catalogues provided.
3. NEVER invent URLs or guarantee employment.
4. Keep all COMPLETED steps preserved in the history.
5. In the "rationale" field, clearly explain what changed and why.
6. If the learner is stuck or needs practice, break down the skill, recommend simpler practice projects, or adjust timeline.
7. If time changed, recalculate estimated days accordingly.

OUTPUT SCHEMA:
{
  "rationale": "<explanation of changes made>",
  "goal": "<goal>",
  "totalEstimatedDays": <number>,
  "steps": [
    {
      "id": "step_<01|02|...>",
      "skillName": "<skill name>",
      "reason": "<why this step>",
      "estimatedDays": <number>,
      "resourceIds": ["<id>"],
      "projectId": "<id or null>",
      "acceptanceCriteria": ["<criterion>"],
      "beginnerTip": "<tip>",
      "status": "<NOT_STARTED|IN_PROGRESS|COMPLETED|BLOCKED>"
    }
  ]
}`;

  const userPrompt = `CURRENT PATHWAY:
${JSON.stringify(currentPathway, null, 2)}

RE-PLAN TRIGGER:
- Reason: ${replanContext.reason}
- Details: ${replanContext.details}
- Current Step: ${replanContext.currentStepId}
${replanContext.updatedConstraints ? `- Updated Constraints: ${JSON.stringify(replanContext.updatedConstraints)}` : ""}

LEARNER CONTEXT:
- Device: ${learner.device}
- Daily time: ${learner.dailyTimeMinutes} mins
- Language: ${learner.preferredLanguage}
- City: ${learner.city}

RESOURCE CATALOGUE:
${JSON.stringify(resources, null, 2)}

PROJECT CATALOGUE:
${JSON.stringify(projects, null, 2)}

Produce the updated pathway JSON now.`;

  return { systemPrompt, userPrompt };
}

export function buildExplanationPrompt(
  skillName: string,
  learnerContext: { preferredLanguage: string; currentSkills: string[] }
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are PathPilot, an AI providing beginner-friendly explanations of tech skills to learners in Tier-2 Indian cities.

RULES:
1. Output ONLY valid JSON.
2. Use clear, simple language without jargon.
3. If preferred language is Hindi or Hinglish, provide a natural Hinglish explanation in hindiExplanation.
4. Relate concepts to everyday analogies.
5. Never promise employment.

OUTPUT SCHEMA:
{
  "skillName": "<skill>",
  "explanation": "<simple explanation>",
  "realWorldAnalogy": "<everyday analogy>",
  "whyItMatters": "<why learning this matters>",
  "hindiExplanation": "<optional Hindi/Hinglish summary or null>"
}`;

  const userPrompt = `Explain "${skillName}" for a beginner who knows: ${learnerContext.currentSkills.join(", ") || "nothing yet"}.
Preferred language: ${learnerContext.preferredLanguage}.`;

  return { systemPrompt, userPrompt };
}
