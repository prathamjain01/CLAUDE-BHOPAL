// =============================================================================
// PATHPILOT API - Main Express Application
// =============================================================================

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import coreRoutes from "./core/routes.js";
import { isAIAvailable } from "./core/ai-client.js";

const app: Express = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));

// Request parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// =============================================================================
// API ROUTES
// =============================================================================

// Core PathPilot routes (MVP features)
app.use("/api", coreRoutes);

// =============================================================================
// ROOT ENDPOINT - API Documentation
// =============================================================================

app.get("/", (_req: Request, res: Response) => {
  res.json({
    service: "PathPilot API",
    tagline: "Don't follow a roadmap. Follow your next move.",
    version: "1.0.0-mvp",
    aiAvailable: isAIAvailable(),
    coreFeatures: {
      "1_SkillGPS": "Calculates your next best learning action",
      "2_LearnBuildProveAdapt": "Checkpoint system with proof-based progression",
      "USP": "Proof-based next move - prove skills before moving forward",
    },
    endpoints: {
      health: "GET /api/health",
      goals: {
        list: "GET /api/goals",
        skills: "GET /api/goals/:goal/skills",
      },
      nextMove: "POST /api/next-move",
      learner: {
        start: "POST /api/learner/start",
        get: "GET /api/learner/:id",
        progress: "GET /api/learner/:id/progress",
        checkpoint: "POST /api/learner/:id/checkpoint",
        replan: "POST /api/learner/:id/replan",
      },
    },
    exampleFlow: [
      "1. POST /api/learner/start - Start learning session",
      "2. POST /api/learner/:id/checkpoint {status: 'LEARNING'} - Start learning",
      "3. POST /api/learner/:id/checkpoint {status: 'BUILDING'} - Start project",
      "4. POST /api/learner/:id/checkpoint {status: 'COMPLETED'} - Mark done",
      "   OR {status: 'STUCK', stuckReason: '...'} - Get help",
    ],
  });
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found. Check GET / for available endpoints.",
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Error]", err.message);

  if (err.name === "ZodError") {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

export default app;
