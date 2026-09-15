import mongoose, { Document, Schema } from "mongoose";

export interface IProgressEvidence {
  type: "github_url" | "deployed_url" | "screenshot" | "text";
  value: string;
  submittedAt?: Date;
}

export interface IProgress extends Document {
  pathwayId: string;
  stepId: string;
  learnerId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
  evidence?: IProgressEvidence;
  difficulty?: number;
  notes?: string;
  blockedReason?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    pathwayId: { type: String, required: true, index: true },
    stepId: { type: String, required: true, index: true },
    learnerId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "BLOCKED"],
      default: "NOT_STARTED",
    },
    evidence: {
      type: {
        type: String,
        enum: ["github_url", "deployed_url", "screenshot", "text"],
      },
      value: { type: String },
      submittedAt: { type: Date, default: Date.now },
    },
    difficulty: { type: Number, min: 1, max: 5 },
    notes: { type: String },
    blockedReason: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// Compound index so one progress record exists per pathway step
ProgressSchema.index({ pathwayId: 1, stepId: 1 }, { unique: true });

export const ProgressModel =
  mongoose.models.Progress ||
  mongoose.model<IProgress>("Progress", ProgressSchema);
