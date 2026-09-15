import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  slug: string;
  name: string;
  category: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  toolingExplanation: string;
  estimatedHours: number;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    toolingExplanation: {
      type: String,
      required: true,
    },
    estimatedHours: {
      type: Number,
      default: 10,
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

export const Skill = mongoose.model<ISkill>('Skill', skillSchema);

export interface ISkillDependency extends Document {
  skillSlug: string;
  prerequisiteSlug: string;
  relationType: 'PREREQUISITE' | 'RECOMMENDED';
}

const skillDependencySchema = new Schema<ISkillDependency>(
  {
    skillSlug: {
      type: String,
      required: true,
      index: true,
    },
    prerequisiteSlug: {
      type: String,
      required: true,
      index: true,
    },
    relationType: {
      type: String,
      enum: ['PREREQUISITE', 'RECOMMENDED'],
      default: 'PREREQUISITE',
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

skillDependencySchema.index({ skillSlug: 1, prerequisiteSlug: 1 }, { unique: true });

export const SkillDependency = mongoose.model<ISkillDependency>('SkillDependency', skillDependencySchema);
