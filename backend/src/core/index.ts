// =============================================================================
// PATHPILOT CORE - Export all core modules
// =============================================================================

export { skillEngine, Skill, Resource, Project } from "./skill-engine.js";
export { callAI, isAIAvailable, explainNextSkill, generateLearningTip, generateStuckHelp, generateCompletionMessage } from "./ai-client.js";
export { nextBestActionService, LearnerInput, NextMoveResponse } from "./next-best-action.js";
export { checkpointService, CheckpointStatus, LearnerState, CheckpointUpdate, CheckpointResponse } from "./checkpoint.js";
