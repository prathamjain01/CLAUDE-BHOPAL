import { LearnerProfile, ILearnerProfile } from './model.js';
import { LearnerIntakeInput, UpdateLearnerProfileInput } from './schema.js';
import { AppError } from '../../utils/apiResponse.js';
import { isDbConnected } from '../../config/db.js';

// In-memory fallback
const memoryProfiles = new Map<string, any>();

export class LearnerService {
  async saveProfile(
    userId: string | undefined,
    sessionId: string | undefined,
    data: LearnerIntakeInput
  ): Promise<any> {
    const key = userId || sessionId || `anon-${Date.now()}`;

    if (isDbConnected()) {
      let query: any = null;
      if (userId) query = { userId };
      else if (sessionId) query = { sessionId };

      let profile: ILearnerProfile | null = null;
      if (query) {
        profile = await LearnerProfile.findOne(query);
      }

      if (profile) {
        Object.assign(profile, data);
        await profile.save();
        return profile.toJSON();
      }

      profile = await LearnerProfile.create({
        ...data,
        userId: userId || undefined,
        sessionId: sessionId || (!userId ? key : undefined),
      });

      return profile.toJSON();
    }

    // In-memory fallback
    const existing = memoryProfiles.get(key);
    const updated = {
      id: existing?.id || `profile-${Date.now()}`,
      userId,
      sessionId: sessionId || key,
      ...data,
      updatedAt: new Date(),
      createdAt: existing?.createdAt || new Date(),
    };
    memoryProfiles.set(key, updated);
    return updated;
  }

  async getProfile(userId?: string, sessionId?: string): Promise<any> {
    if (!userId && !sessionId) {
      throw new AppError('Either user authentication or session identifier is required', 400);
    }

    if (isDbConnected()) {
      const query = userId ? { userId } : { sessionId };
      const profile = await LearnerProfile.findOne(query);
      if (!profile) {
        throw new AppError('Learner profile not found', 404);
      }
      return profile.toJSON();
    }

    const key = userId || sessionId;
    if (key && memoryProfiles.has(key)) {
      return memoryProfiles.get(key);
    }

    throw new AppError('Learner profile not found', 404);
  }

  async getProfileById(id: string): Promise<any> {
    if (isDbConnected()) {
      const profile = await LearnerProfile.findById(id);
      if (!profile) {
        throw new AppError('Learner profile not found', 404);
      }
      return profile.toJSON();
    }

    for (const p of memoryProfiles.values()) {
      if (p.id === id) return p;
    }

    throw new AppError('Learner profile not found', 404);
  }

  async updateProfile(id: string, data: UpdateLearnerProfileInput): Promise<any> {
    if (isDbConnected()) {
      const profile = await LearnerProfile.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!profile) {
        throw new AppError('Learner profile not found', 404);
      }
      return profile.toJSON();
    }

    for (const [k, p] of memoryProfiles.entries()) {
      if (p.id === id) {
        const updated = { ...p, ...data, updatedAt: new Date() };
        memoryProfiles.set(k, updated);
        return updated;
      }
    }

    throw new AppError('Learner profile not found', 404);
  }
}

export const learnerService = new LearnerService();
