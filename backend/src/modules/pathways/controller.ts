import { Request, Response, NextFunction } from "express";
import { pathwayService } from "./service.js";
import { GeneratePathwaySchema, ReplanPathwaySchema, PathwayParamSchema } from "./schema.js";

export class PathwayController {
  async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedBody = GeneratePathwaySchema.parse(req.body);
      const pathway = await pathwayService.generatePathway(parsedBody);
      res.status(201).json({
        success: true,
        message: "Learning pathway generated successfully",
        data: pathway,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = PathwayParamSchema.parse(req.params);
      const pathway = await pathwayService.getPathwayById(id);

      if (!pathway) {
        res.status(404).json({
          success: false,
          message: `Pathway not found for id: ${id}`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: pathway,
      });
    } catch (err) {
      next(err);
    }
  }

  async replan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = PathwayParamSchema.parse(req.params);
      const parsedBody = ReplanPathwaySchema.parse(req.body);
      const updatedPathway = await pathwayService.replanPathway(id, parsedBody);

      res.status(200).json({
        success: true,
        message: "Pathway re-planned successfully",
        data: updatedPathway,
      });
    } catch (err) {
      next(err);
    }
  }

  async share(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = PathwayParamSchema.parse(req.params);
      const shareData = await pathwayService.getShareablePathway(id);

      res.status(200).json({
        success: true,
        data: shareData,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const pathwayController = new PathwayController();
