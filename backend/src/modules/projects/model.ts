import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  slug: string;
  title: string;
  skillSlugs: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  acceptanceCriteria: string[];
  evidenceRequirements: ('github' | 'deployedUrl' | 'screenshot' | 'textExplanation')[];
  estimatedHours: number;
  starterCodeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    skillSlugs: {
      type: [String],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    description: {
      type: String,
      required: true,
    },
    acceptanceCriteria: {
      type: [String],
      required: true,
      default: [],
    },
    evidenceRequirements: {
      type: [String],
      enum: ['github', 'deployedUrl', 'screenshot', 'textExplanation'],
      default: ['github', 'textExplanation'],
    },
    estimatedHours: {
      type: Number,
      default: 8,
    },
    starterCodeUrl: {
      type: String,
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

export const Project = mongoose.model<IProject>('Project', projectSchema);

export interface IProjectSubmission extends Document {
  projectId: string;
  learnerId?: string;
  pathwayId?: string;
  evidence: {
    githubUrl?: string;
    deployedUrl?: string;
    screenshotUrl?: string;
    textExplanation?: string;
  };
  status: 'submitted' | 'reviewed' | 'needs_work';
  notes?: string;
  submittedAt: Date;
}

const projectSubmissionSchema = new Schema<IProjectSubmission>(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    learnerId: {
      type: String,
      index: true,
    },
    pathwayId: {
      type: String,
      index: true,
    },
    evidence: {
      githubUrl: { type: String, trim: true },
      deployedUrl: { type: String, trim: true },
      screenshotUrl: { type: String, trim: true },
      textExplanation: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'needs_work'],
      default: 'submitted',
    },
    notes: { type: String },
    submittedAt: {
      type: Date,
      default: Date.now,
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

export const ProjectSubmission = mongoose.model<IProjectSubmission>(
  'ProjectSubmission',
  projectSubmissionSchema
);
