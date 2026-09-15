import fs from 'fs';
import path from 'path';
import { Skill, ISkill, SkillDependency, ISkillDependency } from './model.js';
import { SkillQuery, AssessmentInput } from './schema.js';
import { AppError } from '../../utils/apiResponse.js';
import { isDbConnected } from '../../config/db.js';

interface RawSkill {
  slug: string;
  name: string;
  category: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  toolingExplanation: string;
  estimatedHours: number;
}

interface RawDependency {
  skillSlug: string;
  prerequisiteSlug: string;
  relationType: 'PREREQUISITE' | 'RECOMMENDED';
}

export class SkillsService {
  private fallbackSkills: RawSkill[] = [];
  private fallbackDependencies: RawDependency[] = [];

  constructor() {
    this.loadFallbackSeeds();
  }

  private loadFallbackSeeds() {
    try {
      const seedsDir = path.resolve(process.cwd(), '../data/seeds');
      const localSeedsDir = path.resolve(process.cwd(), 'data/seeds');
      const targetDir = fs.existsSync(seedsDir) ? seedsDir : localSeedsDir;

      const skillsPath = path.join(targetDir, 'skills.json');
      const depsPath = path.join(targetDir, 'skillDependencies.json');

      if (fs.existsSync(skillsPath)) {
        this.fallbackSkills = JSON.parse(fs.readFileSync(skillsPath, 'utf-8'));
      }
      if (fs.existsSync(depsPath)) {
        this.fallbackDependencies = JSON.parse(fs.readFileSync(depsPath, 'utf-8'));
      }
    } catch {
      // Defaults if files not read
    }
  }

  async getAllSkills(query?: SkillQuery): Promise<RawSkill[]> {
    if (isDbConnected()) {
      const filter: any = {};
      if (query?.category) filter.category = query.category;
      if (query?.level) filter.level = query.level;
      if (query?.search) {
        filter.$or = [
          { name: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
        ];
      }
      const skills = await Skill.find(filter).sort({ name: 1 });
      if (skills.length > 0) {
        return skills.map((s) => s.toJSON());
      }
    }

    // Return fallback seeds
    let list = [...this.fallbackSkills];
    if (query?.category) {
      list = list.filter((s) => s.category.toLowerCase() === query.category?.toLowerCase());
    }
    if (query?.level) {
      list = list.filter((s) => s.level === query.level);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    return list;
  }

  async getSkillBySlug(slug: string): Promise<RawSkill> {
    if (isDbConnected()) {
      const skill = await Skill.findOne({ slug });
      if (skill) return skill.toJSON();
    }

    const fallback = this.fallbackSkills.find((s) => s.slug === slug);
    if (fallback) return fallback;

    throw new AppError(`Skill not found with slug: ${slug}`, 404);
  }

  async getDependencies(): Promise<RawDependency[]> {
    if (isDbConnected()) {
      const deps = await SkillDependency.find();
      if (deps.length > 0) {
        return deps.map((d) => d.toJSON());
      }
    }
    return [...this.fallbackDependencies];
  }

  /**
   * Deterministically resolves relevant target skills based on user's goal.
   */
  resolveTargetSkillsForGoal(goalText: string): string[] {
    const text = goalText.toLowerCase();

    if (text.includes('full') || text.includes('mern')) {
      return [
        'html-basics',
        'css-basics',
        'responsive-design',
        'javascript-fundamentals',
        'react-basics',
        'nodejs-express',
        'mongodb-basics',
        'rest-apis',
      ];
    }

    if (text.includes('backend') || text.includes('api') || text.includes('server')) {
      return ['javascript-fundamentals', 'nodejs-express', 'mongodb-basics', 'rest-apis'];
    }

    // Default to frontend web development
    return ['html-basics', 'css-basics', 'responsive-design', 'javascript-fundamentals', 'react-basics'];
  }

  /**
   * Deterministic Topological Sort on the Directed Acyclic Graph (DAG) of skills.
   * Ensures that prerequisites appear strictly BEFORE the skill requiring them.
   */
  async resolveSkillOrder(targetSlugs: string[], masteredSlugs: string[] = []): Promise<RawSkill[]> {
    const allSkills = await this.getAllSkills();
    const allDeps = await this.getDependencies();

    const skillMap = new Map<string, RawSkill>();
    for (const s of allSkills) {
      skillMap.set(s.slug, s);
    }

    // 1. Expand target skills recursively to include all prerequisites
    const neededSlugs = new Set<string>();
    const toExplore = [...targetSlugs];

    while (toExplore.length > 0) {
      const current = toExplore.pop()!;
      if (!neededSlugs.has(current) && skillMap.has(current)) {
        neededSlugs.add(current);
        const directPrereqs = allDeps
          .filter((d) => d.skillSlug === current && d.relationType === 'PREREQUISITE')
          .map((d) => d.prerequisiteSlug);
        for (const p of directPrereqs) {
          if (!neededSlugs.has(p)) {
            toExplore.push(p);
          }
        }
      }
    }

    // 2. Build adjacency list and in-degree counts for the needed subgraph
    const inDegree = new Map<string, number>();
    const adj = new Map<string, string[]>();

    for (const slug of neededSlugs) {
      inDegree.set(slug, 0);
      adj.set(slug, []);
    }

    for (const dep of allDeps) {
      if (neededSlugs.has(dep.skillSlug) && neededSlugs.has(dep.prerequisiteSlug)) {
        // prerequisiteSlug -> skillSlug
        adj.get(dep.prerequisiteSlug)?.push(dep.skillSlug);
        inDegree.set(dep.skillSlug, (inDegree.get(dep.skillSlug) || 0) + 1);
      }
    }

    // 3. Kahn's algorithm for topological sorting
    const queue: string[] = [];
    for (const [slug, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(slug);
      }
    }

    const orderedSlugs: string[] = [];
    while (queue.length > 0) {
      // Sort queue deterministically for consistent ordering
      queue.sort();
      const u = queue.shift()!;
      orderedSlugs.push(u);

      for (const v of adj.get(u) || []) {
        inDegree.set(v, (inDegree.get(v) || 1) - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }

    // 4. Filter out skills the learner already mastered
    const masteredSet = new Set(masteredSlugs);
    const missingSlugs = orderedSlugs.filter((slug) => !masteredSet.has(slug));

    return missingSlugs.map((slug) => skillMap.get(slug)!).filter(Boolean);
  }

  /**
   * Evaluates learner's current skills vs target goal, returning:
   * - Mastered skills
   * - Next immediate milestone
   * - Later skills in the sequence
   */
  async evaluateAssessment(input: AssessmentInput): Promise<{
    goal: string;
    mastered: RawSkill[];
    next: RawSkill[];
    later: RawSkill[];
  }> {
    const allSkills = await this.getAllSkills();
    const skillMap = new Map(allSkills.map((s) => [s.slug, s]));

    const targetSlugs = input.targetSkills && input.targetSkills.length > 0
      ? input.targetSkills
      : this.resolveTargetSkillsForGoal(input.goal);

    const orderedMissing = await this.resolveSkillOrder(targetSlugs, input.currentSkills);

    const mastered = (input.currentSkills || [])
      .map((slug) => skillMap.get(slug))
      .filter(Boolean) as RawSkill[];

    const next = orderedMissing.slice(0, 1);
    const later = orderedMissing.slice(1);

    return {
      goal: input.goal,
      mastered,
      next,
      later,
    };
  }
}

export const skillsService = new SkillsService();
