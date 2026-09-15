// =============================================================================
// PATHPILOT CORE API ROUTES
// =============================================================================
// MVP Endpoints:
//
// GET  /api/goals                    - Available learning goals
// GET  /api/goals/:goal/skills       - Skills needed for a goal
// POST /api/next-move                - Get next best action (Core Feature 1)
// POST /api/learner/start            - Start a learning session
// GET  /api/learner/:id              - Get learner state
// GET  /api/learner/:id/progress     - Get progress summary
// POST /api/learner/:id/checkpoint   - Update checkpoint (Core Feature 2)
// POST /api/learner/:id/replan       - Re-plan based on feedback
// =============================================================================

import { Router, Request, Response } from "express";
import { nextBestActionService, LearnerInput } from "./next-best-action.js";
import { checkpointService, CheckpointUpdate } from "./checkpoint.js";
import { isAIAvailable } from "./ai-client.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// =============================================================================
// HEALTH & STATUS
// =============================================================================

/**
 * GET /api/health
 * Health check with AI status
 */
router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "PathPilot API",
    version: "1.0.0-mvp",
    aiAvailable: isAIAvailable(),
    features: {
      skillGPS: true,
      learnBuildProveAdapt: true,
      proofBasedNextMove: true,
    },
  });
});

// =============================================================================
// GOALS & SKILLS (Read-only, from Skill Engine)
// =============================================================================

/**
 * GET /api/goals
 * Get available learning goals
 */
router.get("/goals", (_req: Request, res: Response) => {
  const goals = nextBestActionService.getAvailableGoals();
  res.json({
    success: true,
    data: goals,
  });
});

/**
 * GET /api/goals/:goal/skills
 * Get skills needed for a specific goal
 */
router.get("/goals/:goal/skills", (req: Request, res: Response) => {
  const goal = req.params.goal as string;
  const skills = nextBestActionService.getSkillsForGoal(goal);
  res.json({
    success: true,
    data: {
      goal,
      skills,
      totalSkills: skills.length,
    },
  });
});

// =============================================================================
// NEXT BEST ACTION (Core Feature 1)
// =============================================================================

/**
 * POST /api/next-move
 * Get the next best learning action for a learner
 *
 * Body:
 * {
 *   goal: string,
 *   currentSkills: string[],
 *   dailyMinutes: number,
 *   device: "mobile" | "laptop" | "both",
 *   name?: string
 * }
 */
router.post("/next-move", async (req: Request, res: Response) => {
  try {
    const input: LearnerInput = {
      goal: req.body.goal || "Frontend Developer",
      currentSkills: req.body.currentSkills || [],
      dailyMinutes: req.body.dailyMinutes || 60,
      device: req.body.device || "laptop",
      name: req.body.name,
    };

    const nextMove = await nextBestActionService.getNextMove(input);

    res.json({
      success: true,
      data: nextMove,
    });
  } catch (error) {
    console.error("[API] Error getting next move:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate next move",
    });
  }
});

// =============================================================================
// LEARNER SESSION & CHECKPOINTS (Core Feature 2)
// =============================================================================

/**
 * POST /api/learner/start
 * Start a new learning session
 *
 * Body: Same as /api/next-move
 * Returns: learnerId + learnerState + nextMove
 */
router.post("/learner/start", async (req: Request, res: Response) => {
  try {
    const learnerId = uuidv4();
    const input: LearnerInput = {
      goal: req.body.goal || "Frontend Developer",
      currentSkills: req.body.currentSkills || [],
      dailyMinutes: req.body.dailyMinutes || 60,
      device: req.body.device || "laptop",
      name: req.body.name,
    };

    const { learnerState, nextMove } = await checkpointService.initializeLearner(
      learnerId,
      input
    );

    res.status(201).json({
      success: true,
      message: "Learning session started! Here's your first move.",
      data: {
        learnerId,
        learnerState,
        nextMove,
      },
    });
  } catch (error) {
    console.error("[API] Error starting session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start learning session",
    });
  }
});

/**
 * GET /api/learner/:id
 * Get learner state
 */
router.get("/learner/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const learnerState = checkpointService.getLearnerState(id);

  if (!learnerState) {
    res.status(404).json({
      success: false,
      message: "Learner not found. Start a new session with POST /api/learner/start",
    });
    return;
  }

  res.json({
    success: true,
    data: learnerState,
  });
});

/**
 * GET /api/learner/:id/progress
 * Get progress summary
 */
router.get("/learner/:id/progress", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const progress = checkpointService.getProgress(id);

  if (!progress) {
    res.status(404).json({
      success: false,
      message: "Learner not found",
    });
    return;
  }

  res.json({
    success: true,
    data: progress,
  });
});

/**
 * POST /api/learner/:id/checkpoint
 * Update checkpoint status (Learn → Build → Prove → Adapt)
 *
 * Body:
 * {
 *   status: "LEARNING" | "BUILDING" | "STUCK" | "COMPLETED",
 *   stuckReason?: string  // Required if status is STUCK
 * }
 */
router.post("/learner/:id/checkpoint", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const update: CheckpointUpdate = {
      status: req.body.status,
      stuckReason: req.body.stuckReason,
    };

    if (!update.status) {
      res.status(400).json({
        success: false,
        message: "Status is required. Use: LEARNING, BUILDING, STUCK, or COMPLETED",
      });
      return;
    }

    const result = await checkpointService.updateCheckpoint(id, update);

    res.json({
      success: result.success,
      message: result.message,
      data: {
        learnerState: result.learnerState,
        nextMove: result.nextMove,
        stuckHelp: result.stuckHelp,
      },
    });
  } catch (error) {
    console.error("[API] Error updating checkpoint:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update checkpoint",
    });
  }
});

/**
 * POST /api/learner/:id/replan
 * Re-plan based on changed constraints
 *
 * Body:
 * {
 *   newDailyMinutes?: number,
 *   newDevice?: "mobile" | "laptop" | "both"
 * }
 */
router.post("/learner/:id/replan", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const feedback = {
      newDailyMinutes: req.body.newDailyMinutes,
      newDevice: req.body.newDevice,
    };

    const result = await checkpointService.replan(id, feedback);

    res.json({
      success: true,
      message: "Plan updated based on your new constraints.",
      data: result,
    });
  } catch (error) {
    console.error("[API] Error replanning:", error);
    res.status(500).json({
      success: false,
      message: "Failed to replan",
    });
  }
});

export default router;
