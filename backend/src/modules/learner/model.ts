import mongoose, { Document, Schema } from 'mongoose';

export interface ILearnerProfile extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  goal: string;
  currentSkills: string[];
  priorExposure?: string;
  device: 'laptop' | 'desktop' | 'mobile_only' | 'shared_computer';
  availableHoursPerDay: number;
  internetQuality: 'stable_broadband' | 'mobile_data_limited' | 'slow_intermittent';
  preferredLanguage: 'en' | 'hi' | 'hinglish';
  city: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const learnerProfileSchema = new Schema<ILearnerProfile>(
  {
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
      trim: true,
    },
    currentSkills: {
      type: [String],
      default: [],
    },
    priorExposure: {
      type: String,
      trim: true,
    },
    device: {
      type: String,
      enum: ['laptop', 'desktop', 'mobile_only', 'shared_computer'],
      default: 'laptop',
    },
    availableHoursPerDay: {
      type: Number,
      required: true,
      min: 0.5,
      max: 16,
    },
    internetQuality: {
      type: String,
      enum: ['stable_broadband', 'mobile_data_limited', 'slow_intermittent'],
      default: 'mobile_data_limited',
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi', 'hinglish'],
      default: 'en',
    },
    city: {
      type: String,
      default: 'Bhopal',
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
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

export const LearnerProfile = mongoose.model<ILearnerProfile>('LearnerProfile', learnerProfileSchema);
