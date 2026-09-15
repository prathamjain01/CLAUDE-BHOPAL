import mongoose, { Document, Schema } from 'mongoose';

export interface IProgressRecord extends Document {
  pathwayId: string;
  stepId: string;
  learnerId?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  difficultyRating?: number;
  notes?: string;
  evidence?: {
    githubUrl?: string;
    deployedUrl?: string;
    screenshotUrl?: string;
    textExplanation?: string;
  };
  completedAt?: Date;
  createdAt: Date;
}

const progressRecordSchema = new Schema<IProgressRecord>(
  {
    pathwayId: {
      type: String,
      required: true,
      index: true,
    },
    stepId: {
      type: String,
      required: true,
      index: true,
    },
    learnerId: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'],
      required: true,
    },
    difficultyRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
    },
    evidence: {
      githubUrl: { type: String },
      deployedUrl: { type: String },
      screenshotUrl: { type: String },
      textExplanation: { type: String },
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const ProgressRecord = mongoose.model<IProgressRecord>('ProgressRecord', progressRecordSchema);
