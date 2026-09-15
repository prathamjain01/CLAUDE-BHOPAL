import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  slug: string;
  title: string;
  url: string;
  provider: string;
  skillSlug: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationHours: number;
  language: 'en' | 'hi' | 'hinglish';
  cost: 'free' | 'freemium' | 'paid';
  mobileFriendly: boolean;
  prerequisites: string[];
  qualityScore: number;
  lastReviewedDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
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
    url: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    skillSlug: {
      type: String,
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    durationHours: {
      type: Number,
      default: 5,
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'hinglish'],
      default: 'en',
    },
    cost: {
      type: String,
      enum: ['free', 'freemium', 'paid'],
      default: 'free',
    },
    mobileFriendly: {
      type: Boolean,
      default: true,
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    qualityScore: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    lastReviewedDate: {
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

export const Resource = mongoose.model<IResource>('Resource', resourceSchema);
