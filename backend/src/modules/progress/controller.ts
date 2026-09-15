import { Request, Response, NextFunction } from "express";
import { progressService } from "./service.js";
import { UpdateProgressSchema, StepParamSchema, PathwayParamSchema } from "./schema.js";

export class ProgressController {
  async updateStep(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { stepId } = StepParamSchema.parse(req.params);
      const parsedBody = UpdateProgressSchema.parse(req.body);

      const result = await progressService.updateStepProgress(stepId, parsedBody);

      res.status(200).json({
        success: true,
        message: "Step progress updated successfully",
        data: result.progress,
        suggestReplan: result.suggestReplan,
        replanReason: result.replanReason,
      });
    } catch (err) {
      next(err);
    }
  }

  async getByPathway(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pathwayId } = PathwayParamSchema.parse(req.params);
      const progressList = await progressService.getProgressByPathway(pathwayId);

      res.status(200).json({
        success: true,
        data: progressList,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pathwayId } = PathwayParamSchema.parse(req.params);
      const summary = await progressService.getProgressSummary(pathwayId);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const progressController = new ProgressController();
