import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface IPathwayStep {
  stepId: string;
  skillSlug: string;
  skillName: string;
  category: string;
  reason: string;
  beginnerTip: string;
  estimatedDays: number;
  resource: {
    title: string;
    url: string;
    provider: string;
    cost: string;
    mobileFriendly: boolean;
    language: string;
    durationHours: number;
  };
  project?: {
    slug: string;
    title: string;
    description: string;
    acceptanceCriteria: string[];
    evidenceRequirements: string[];
    estimatedHours: number;
  };
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  completedAt?: Date;
  notes?: string;
}

export interface ILearningPath extends Document {
  shareId: string;
  learnerProfileId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  goal: string;
  title: string;
  overview: string;
  encouragementMessage: string;
  totalEstimatedDays: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  currentStepIndex: number;
  steps: IPathwayStep[];
  createdAt: Date;
  updatedAt: Date;
}

const pathwayStepSchema = new Schema<IPathwayStep>(
  {
    stepId: { type: String, required: true },
    skillSlug: { type: String, required: true },
    skillName: { type: String, required: true },
    category: { type: String, default: 'General' },
    reason: { type: String, required: true },
    beginnerTip: { type: String, default: 'Focus on hands-on practice.' },
    estimatedDays: { type: Number, default: 7 },
    resource: {
      title: { type: String, required: true },
      url: { type: String, required: true },
      provider: { type: String, required: true },
      cost: { type: String, default: 'free' },
      mobileFriendly: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
      durationHours: { type: Number, default: 5 },
    },
    project: {
      slug: { type: String },
      title: { type: String },
      description: { type: String },
      acceptanceCriteria: { type: [String], default: [] },
      evidenceRequirements: { type: [String], default: [] },
      estimatedHours: { type: Number },
    },
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'],
      default: 'NOT_STARTED',
    },
    completedAt: { type: Date },
    notes: { type: String },
  },
  { _id: false }
);

const learningPathSchema = new Schema<ILearningPath>(
  {
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => `path_${crypto.randomBytes(4).toString('hex')}`,
    },
    learnerProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'LearnerProfile',
      sparse: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      sparse: true,
      index: true,
    },
    sessionId: {
      type: String,
      sparse: true,
      index: true,
    },
    goal: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    encouragementMessage: {
      type: String,
      required: true,
    },
    totalEstimatedDays: {
      type: Number,
      default: 30,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'COMPLETED'],
      default: 'ACTIVE',
    },
    currentStepIndex: {
      type: Number,
      default: 0,
    },
    steps: {
      type: [pathwayStepSchema],
      default: [],
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

export const LearningPath = mongoose.model<ILearningPath>('LearningPath', learningPathSchema);
