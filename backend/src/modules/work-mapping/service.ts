import fs from 'fs';
import path from 'path';
import { WorkCategory, IWorkCategory } from './model.js';
import { WorkCategoryFilter } from './schema.js';
import { AppError } from '../../utils/apiResponse.js';
import { isDbConnected } from '../../config/db.js';

export interface RawWorkCategory {
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
}

export class WorkMappingService {
  private fallbackCategories: RawWorkCategory[] = [];

  constructor() {
    this.loadFallbackSeeds();
  }

  private loadFallbackSeeds() {
    try {
      const seedsDir = path.resolve(process.cwd(), '../data/seeds');
      const localSeedsDir = path.resolve(process.cwd(), 'data/seeds');
      const targetDir = fs.existsSync(seedsDir) ? seedsDir : localSeedsDir;
      const wcPath = path.join(targetDir, 'workCategories.json');
      if (fs.existsSync(wcPath)) {
        this.fallbackCategories = JSON.parse(fs.readFileSync(wcPath, 'utf-8'));
      }
    } catch {
      // Defaults
    }
  }

  async getAllCategories(query?: WorkCategoryFilter): Promise<any> {
    let categories: RawWorkCategory[] = [];

    if (isDbConnected()) {
      const filter: any = {};
      if (query?.locationType) filter.locationType = query.locationType;
      if (query?.skill) filter.requiredSkills = query.skill;

      const docs = await WorkCategory.find(filter);
      if (docs.length > 0) {
        categories = docs.map((d) => d.toJSON());
      }
    }

    if (categories.length === 0) {
      categories = [...this.fallbackCategories];
      if (query?.locationType) {
        categories = categories.filter((c) => c.locationType === query.locationType);
      }
      if (query?.skill) {
        categories = categories.filter((c) => c.requiredSkills.includes(query.skill!));
      }
    }

    // If learner skills provided, calculate alignment
    if (query?.learnerSkills && query.learnerSkills.length > 0) {
      return this.calculateAlignment(categories, query.learnerSkills);
    }

    return {
      categories,
      disclaimer:
        'This mapping describes skill alignments and typical requirements in Bhopal, Indore, and Remote roles. It does not guarantee employment or job placement.',
    };
  }

  async getCategoryBySlug(slug: string): Promise<RawWorkCategory> {
    if (isDbConnected()) {
      const cat = await WorkCategory.findOne({ slug });
      if (cat) return cat.toJSON();
    }

    const fallback = this.fallbackCategories.find((c) => c.slug === slug);
    if (fallback) return fallback;

    throw new AppError(`Work category not found with slug: ${slug}`, 404);
  }

  calculateAlignment(categories: RawWorkCategory[], learnerSkills: string[]) {
    const learnerSet = new Set(learnerSkills.map((s) => s.toLowerCase()));

    const mappings = categories.map((cat) => {
      const matchedRequired = cat.requiredSkills.filter((s) => learnerSet.has(s.toLowerCase()));
      const missingRequired = cat.requiredSkills.filter((s) => !learnerSet.has(s.toLowerCase()));
      const matchPercentage =
        cat.requiredSkills.length > 0
          ? Math.round((matchedRequired.length / cat.requiredSkills.length) * 100)
          : 0;

      return {
        ...cat,
        matchedRequiredSkills: matchedRequired,
        missingRequiredSkills: missingRequired,
        matchPercentage,
        isUnlocked: missingRequired.length === 0,
      };
    });

    // Sort by highest match percentage first
    mappings.sort((a, b) => b.matchPercentage - a.matchPercentage);

    const fullyUnlockedCount = mappings.filter((m) => m.isUnlocked).length;

    return {
      mappings,
      totalCategories: mappings.length,
      fullyUnlockedCount,
      learnerSkillsProvided: learnerSkills,
      disclaimer:
        'This mapping describes skill alignments and typical requirements in Bhopal, Indore, and Remote roles. It does not guarantee employment or job placement.',
    };
  }
}

export const workMappingService = new WorkMappingService();
