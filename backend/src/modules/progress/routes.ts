import { Router } from "express";
import { progressController } from "./controller.js";

const router = Router();

router.patch("/:stepId", (req, res, next) => progressController.updateStep(req, res, next));
router.get("/pathway/:pathwayId", (req, res, next) => progressController.getByPathway(req, res, next));
router.get("/pathway/:pathwayId/summary", (req, res, next) => progressController.getSummary(req, res, next));

export default router;
