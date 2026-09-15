import { Router } from "express";
import pathwayRoutes from "../modules/pathways/routes.js";
import progressRoutes from "../modules/progress/routes.js";

const router = Router();

// Mount Developer 3 owned route modules
router.use("/pathways", pathwayRoutes);
router.use("/progress", progressRoutes);

// Health check endpoint
router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "PathPilot API" });
});

export default router;
