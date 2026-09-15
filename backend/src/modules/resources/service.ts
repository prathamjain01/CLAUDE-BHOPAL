import fs from 'fs';
import path from 'path';
import { Resource, IResource } from './model.js';
import { ResourceFilter } from './schema.js';
import { AppError } from '../../utils/apiResponse.js';
import { isDbConnected } from '../../config/db.js';

export interface RawResource {
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
}

export class ResourcesService {
  private fallbackResources: RawResource[] = [];

  constructor() {
    this.loadFallbackSeeds();
  }

  private loadFallbackSeeds() {
    try {
      const seedsDir = path.resolve(process.cwd(), '../data/seeds');
      const localSeedsDir = path.resolve(process.cwd(), 'data/seeds');
      const targetDir = fs.existsSync(seedsDir) ? seedsDir : localSeedsDir;
      const resPath = path.join(targetDir, 'resources.json');
      if (fs.existsSync(resPath)) {
        this.fallbackResources = JSON.parse(fs.readFileSync(resPath, 'utf-8'));
      }
    } catch {
      // Defaults
    }
  }

  async getAllResources(query?: ResourceFilter): Promise<RawResource[]> {
    if (isDbConnected()) {
      const filter: any = {};
      if (query?.skillSlug) filter.skillSlug = query.skillSlug;
      if (query?.level) filter.level = query.level;
      if (query?.language) filter.language = query.language;
      if (query?.mobileFriendly !== undefined) filter.mobileFriendly = query.mobileFriendly;
      if (query?.cost) filter.cost = query.cost;
      if (query?.search) {
        filter.$or = [
          { title: { $regex: query.search, $options: 'i' } },
          { provider: { $regex: query.search, $options: 'i' } },
        ];
      }

      const resources = await Resource.find(filter).sort({ qualityScore: -1 });
      if (resources.length > 0) {
        return resources.map((r) => r.toJSON());
      }
    }

    // Fallback in-memory
    let list = [...this.fallbackResources];
    if (query?.skillSlug) list = list.filter((r) => r.skillSlug === query.skillSlug);
    if (query?.level) list = list.filter((r) => r.level === query.level);
    if (query?.language) list = list.filter((r) => r.language === query.language);
    if (query?.mobileFriendly !== undefined) list = list.filter((r) => r.mobileFriendly === query.mobileFriendly);
    if (query?.cost) list = list.filter((r) => r.cost === query.cost);
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q));
    }
    return list;
  }

  async getResourceBySlug(slug: string): Promise<RawResource> {
    if (isDbConnected()) {
      const res = await Resource.findOne({ slug });
      if (res) return res.toJSON();
    }

    const fallback = this.fallbackResources.find((r) => r.slug === slug);
    if (fallback) return fallback;

    throw new AppError(`Resource not found with slug: ${slug}`, 404);
  }

  /**
   * Deterministically finds the highest-rated free resource for a given skill
   * matching learner constraints (language preference, mobile device compatibility).
   */
  async findBestResourceForSkill(
    skillSlug: string,
    constraints: {
      preferredLanguage?: string;
      device?: string;
    } = {}
  ): Promise<RawResource | null> {
    const all = await this.getAllResources({ skillSlug, cost: 'free' });
    if (all.length === 0) {
      // Try any resource for this skill
      const anyRes = await this.getAllResources({ skillSlug });
      return anyRes[0] || null;
    }

    // Sort by match score
    const scored = all.map((r) => {
      let score = r.qualityScore * 10;

      // Language preference
      if (constraints.preferredLanguage) {
        if (r.language === constraints.preferredLanguage) {
          score += 20;
        } else if (constraints.preferredLanguage === 'hinglish' && (r.language === 'hi' || r.language === 'en')) {
          score += 10;
        }
      }

      // Mobile device constraint
      if (constraints.device === 'mobile_only') {
        if (r.mobileFriendly) {
          score += 15;
        } else {
          score -= 30; // Strongly penalize desktop-only resources for mobile-only learners
        }
      }

      return { resource: r, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.resource || all[0];
  }
}

export const resourcesService = new ResourcesService();
