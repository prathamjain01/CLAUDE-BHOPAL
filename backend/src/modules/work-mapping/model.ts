import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkCategory extends Document {
  slug: string;
  title: string;
  locationType: 'Bhopal' | 'Indore' | 'Remote';
  requiredSkills: string[];
  optionalSkills: string[];
  description: string;
  typicalRoles: string[];
  localContext: string;
  source: string;
  disclaimer: string;
  createdAt: Date;
  updatedAt: Date;
}

const workCategorySchema = new Schema<IWorkCategory>(
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
    locationType: {
      type: String,
      enum: ['Bhopal', 'Indore', 'Remote'],
      required: true,
      index: true,
    },
    requiredSkills: {
      type: [String],
      required: true,
      index: true,
    },
    optionalSkills: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    typicalRoles: {
      type: [String],
      default: [],
    },
    localContext: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: 'Tier-2 IT Ecosystem Survey 2024-2025',
    },
    disclaimer: {
      type: String,
      default:
        'This mapping describes skill alignments and typical requirements. It does not guarantee employment or job placement.',
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

export const WorkCategory = mongoose.model<IWorkCategory>('WorkCategory', workCategorySchema);
