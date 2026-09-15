import mongoose, { Document, Schema } from "mongoose";

export interface IPathwayStep {
  id: string;
  skillId?: string;
  skillName: string;
  reason: string;
  estimatedDays: number;
  resourceIds: string[];
  projectId?: string | null;
  acceptanceCriteria: string[];
  beginnerTip?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
  order: number;
}

export interface ILearningPath extends Document {
  learnerId: string;
  goal: string;
  version: number;
  isActive: boolean;
  totalEstimatedDays: number;
  steps: IPathwayStep[];
  replanHistory: Array<{
    version: number;
    reason: string;
    rationale: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const PathwayStepSchema = new Schema<IPathwayStep>(
  {
    id: { type: String, required: true },
    skillId: { type: String },
    skillName: { type: String, required: true },
    reason: { type: String, required: true },
    estimatedDays: { type: Number, required: true, default: 7 },
    resourceIds: [{ type: String }],
    projectId: { type: String, default: null },
    acceptanceCriteria: [{ type: String }],
    beginnerTip: { type: String },
    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "BLOCKED"],
      default: "NOT_STARTED",
    },
    order: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const LearningPathSchema = new Schema<ILearningPath>(
  {
    learnerId: { type: String, required: true, index: true },
    goal: { type: String, required: true },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    totalEstimatedDays: { type: Number, default: 30 },
    steps: [PathwayStepSchema],
    replanHistory: [
      {
        version: { type: Number, required: true },
        reason: { type: String, required: true },
        rationale: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const LearningPathModel =
  mongoose.models.LearningPath ||
  mongoose.model<ILearningPath>("LearningPath", LearningPathSchema);
