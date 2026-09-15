// =============================================================================
// PATHPILOT SERVER - Entry Point
// =============================================================================

import "dotenv/config";
import app from "./src/app.js";
import { isAIAvailable } from "./src/core/ai-client.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║                   PATHPILOT API                          ║");
  console.log("║     Don't follow a roadmap. Follow your next move.       ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  // Check AI availability
  if (isAIAvailable()) {
    console.log("✓ [AI] Gemini API connected - personalized explanations enabled");
  } else {
    console.log("⚠ [AI] No GEMINI_API_KEY - using deterministic fallback");
    console.log("        (Add GEMINI_API_KEY to .env for AI-powered features)");
  }

  // MVP: Running in-memory (no MongoDB needed for hackathon)
  console.log("✓ [DB] In-memory storage active (MVP mode)");

  // Start HTTP server
  app.listen(PORT, () => {
    console.log(`\n✓ [Server] Running on http://localhost:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || "development"}\n`);

    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║  CORE FEATURES:                                          ║");
    console.log("║  1. Skill GPS - Next Best Action                         ║");
    console.log("║  2. Learn → Build → Prove → Adapt                        ║");
    console.log("║  USP: Proof-Based Next Move                              ║");
    console.log("╠══════════════════════════════════════════════════════════╣");
    console.log("║  ENDPOINTS:                                              ║");
    console.log(`║  GET  http://localhost:${PORT}/api/health                    ║`);
    console.log(`║  GET  http://localhost:${PORT}/api/goals                     ║`);
    console.log(`║  POST http://localhost:${PORT}/api/next-move                 ║`);
    console.log(`║  POST http://localhost:${PORT}/api/learner/start             ║`);
    console.log(`║  POST http://localhost:${PORT}/api/learner/:id/checkpoint    ║`);
    console.log("╚══════════════════════════════════════════════════════════╝\n");
  });
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[Server] Shutting down...");
  process.exit(0);
});

startServer().catch((err) => {
  console.error("[Server] Failed to start:", err);
  process.exit(1);
});
