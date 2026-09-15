// ---------------------------------------------------------------------------
// PathPilot TypeScript Types
// ---------------------------------------------------------------------------

export type StepStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";

export interface PathwayStep {
  id: string;
  skillId?: string;
  skillName: string;
  reason: string;
  estimatedDays: number;
  resourceIds: string[];
  projectId?: string | null;
  acceptanceCriteria: string[];
  beginnerTip?: string;
  status: StepStatus;
  order: number;
}

export interface LearningPathway {
  _id: string;
  learnerId?: string;
  goal: string;
  version: number;
  isActive: boolean;
  totalEstimatedDays: number;
  steps: PathwayStep[];
  replanHistory?: Array<{
    version: number;
    reason: string;
    rationale: string;
    timestamp: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resource {
  id: string;
  title: string;
  provider: string;
  skillId: string;
  level: "beginner" | "intermediate" | "advanced";
  durationHours: number;
  language: string;
  isMobileFriendly: boolean;
  url: string;
  isFree?: boolean;
}

export interface Project {
  id: string;
  title: string;
  skillIds: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  acceptanceCriteria: string[];
  starterTemplateUrl?: string;
}

export interface ProgressEvidence {
  type: "github_url" | "deployed_url" | "screenshot" | "text";
  value: string;
  submittedAt?: string;
}

export interface ProgressRecord {
  pathwayId: string;
  stepId: string;
  learnerId?: string;
  status: StepStatus;
  evidence?: ProgressEvidence;
  difficulty?: number;
  notes?: string;
  blockedReason?: string;
  completedAt?: string;
}

export interface ProgressSummary {
  pathwayId: string;
  totalSteps: number;
  completedSteps: number;
  completionPercentage: number;
  currentStepId: string;
  isBlocked: boolean;
  blockedStepId?: string | null;
}

export interface LearnerProfile {
  id?: string;
  goal: string;
  currentSkills: string[];
  device: "laptop" | "desktop" | "mobile" | "tablet" | "any";
  dailyTimeMinutes: number;
  internetQuality: "broadband" | "mobile_data" | "low_bandwidth" | "intermittent";
  preferredLanguage: string;
  city: string;
  priorExposure?: string;
}

export interface ReplanRequest {
  reason: "completed" | "need_more_practice" | "stuck" | "time_changed" | "goal_changed";
  details: string;
  stepId?: string;
  updatedConstraints?: Partial<LearnerProfile>;
}
