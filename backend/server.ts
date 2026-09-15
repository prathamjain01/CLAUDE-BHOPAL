// =============================================================================
// PATHPILOT SERVER - Entry Point
// =============================================================================

import "dotenv/config";
import app from "./src/app.js";

// Vercel needs the Express app exported as a serverless function.
export default app;

// Local development only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`\n✓ [Server] Running on http://localhost:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || "development"}\n`);
  });
}