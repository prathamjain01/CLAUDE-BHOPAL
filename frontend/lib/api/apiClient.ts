// =============================================================================
// PathPilot API Client - Connects frontend to backend
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Types matching backend responses
export interface Skill {
  id: string;
  name: string;
  description?: string;
  estimatedHours?: number;
  estimatedDays?: number;
}

export interface Resource {
  id: string;
  title: string;
  provider: string;
  url: string;
  type: string;
  durationMinutes: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  acceptanceCriteria: string[];
  starterHint: string;
}

export interface NextMoveResponse {
  learner: {
    goal: string;
    knownSkills: string[];
    device: string;
    dailyMinutes: number;
  };
  skillGap: {
    totalRequired: number;
    alreadyKnow: number;
    stillNeed: number;
    progressPercent: number;
  };
  nextMove: {
    skill: Skill;
    whyThisSkill: string;
    learningTip: string;
  } | null;
  resources: Resource[];
  claudePrompt: string | null;
  project: Project | null;
  isComplete: boolean;
  aiPowered: boolean;
}

export interface LearnerState {
  learnerId: string;
  goal: string;
  currentSkills: string[];
  dailyMinutes: number;
  device: string;
  name?: string;
  currentCheckpoint: {
    skillId: string;
    status: "NOT_STARTED" | "LEARNING" | "BUILDING" | "STUCK" | "COMPLETED";
    startedAt: string;
    stuckReason?: string;
  } | null;
  completedSkills: Array<{
    skillId: string;
    skillName: string;
    completedAt: string;
    projectTitle: string;
  }>;
}

export interface StartSessionResponse {
  learnerId: string;
  learnerState: LearnerState;
  nextMove: NextMoveResponse;
}

export interface CheckpointResponse {
  success: boolean;
  message: string;
  learnerState: LearnerState;
  nextMove?: NextMoveResponse;
  stuckHelp?: {
    explanation: string;
    simplifiedSteps: string[];
    encouragement: string;
  };
}

export interface ProgressResponse {
  totalSkills: number;
  completedSkills: number;
  progressPercent: number;
  currentSkill: string | null;
  currentStatus: string | null;
  completedList: Array<{ name: string; completedAt: string }>;
}

// API Functions
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json();

  if (!data.success && response.status >= 400) {
    throw new Error(data.message || "API request failed");
  }

  return data.data;
}

// Health Check (returns data directly, not wrapped in {success, data})
export async function checkHealth(): Promise<{ status: string; aiAvailable: boolean }> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

// Get available goals
export async function getGoals(): Promise<string[]> {
  return apiCall("/goals");
}

// Get skills for a goal
export async function getSkillsForGoal(goal: string): Promise<{ goal: string; skills: Skill[]; totalSkills: number }> {
  return apiCall(`/goals/${encodeURIComponent(goal)}/skills`);
}

// Get next move (without starting session)
export async function getNextMove(input: {
  goal: string;
  currentSkills: string[];
  dailyMinutes: number;
  device: string;
  name?: string;
}): Promise<NextMoveResponse> {
  return apiCall("/next-move", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Start a learning session
export async function startSession(input: {
  goal: string;
  currentSkills: string[];
  dailyMinutes: number;
  device: string;
  name?: string;
  isCustomGoal?: boolean;
  background?: string;
}): Promise<StartSessionResponse> {
  return apiCall("/learner/start", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Get learner state
export async function getLearnerState(learnerId: string): Promise<LearnerState> {
  return apiCall(`/learner/${learnerId}`);
}

// Get progress
export async function getProgress(learnerId: string): Promise<ProgressResponse> {
  return apiCall(`/learner/${learnerId}/progress`);
}

// Update checkpoint
export async function updateCheckpoint(
  learnerId: string,
  status: "LEARNING" | "BUILDING" | "STUCK" | "COMPLETED",
  stuckReason?: string
): Promise<CheckpointResponse> {
  const response = await fetch(`${API_BASE_URL}/learner/${learnerId}/checkpoint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, stuckReason }),
  });

  const data = await response.json();
  return {
    success: data.success,
    message: data.message,
    learnerState: data.data?.learnerState,
    nextMove: data.data?.nextMove,
    stuckHelp: data.data?.stuckHelp,
  };
}

// Replan
export async function replan(
  learnerId: string,
  options: { newDailyMinutes?: number; newDevice?: string }
): Promise<{ learnerState: LearnerState; nextMove: NextMoveResponse }> {
  return apiCall(`/learner/${learnerId}/replan`, {
    method: "POST",
    body: JSON.stringify(options),
  });
}

// Local storage helpers for session persistence
export function saveLearnerId(learnerId: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("pathpilot_learner_id", learnerId);
  }
}

export function getStoredLearnerId(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("pathpilot_learner_id");
  }
  return null;
}

export function clearLearnerId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("pathpilot_learner_id");
  }
}
