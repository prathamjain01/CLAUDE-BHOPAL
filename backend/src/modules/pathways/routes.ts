import { Router } from "express";
import { pathwayController } from "./controller.js";

const router = Router();

router.post("/generate", (req, res, next) => pathwayController.generate(req, res, next));
router.get("/:id", (req, res, next) => pathwayController.getById(req, res, next));
router.post("/:id/replan", (req, res, next) => pathwayController.replan(req, res, next));
router.get("/:id/share", (req, res, next) => pathwayController.share(req, res, next));

export default router;
