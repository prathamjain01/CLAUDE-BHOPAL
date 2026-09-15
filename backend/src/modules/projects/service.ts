import fs from 'fs';
import path from 'path';
import { Project, IProject, ProjectSubmission, IProjectSubmission } from './model.js';
import { ProjectQuery, ProjectSubmissionInput } from './schema.js';
import { AppError } from '../../utils/apiResponse.js';
import { isDbConnected } from '../../config/db.js';

export interface RawProject {
  slug: string;
  title: string;
  skillSlugs: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  acceptanceCriteria: string[];
  evidenceRequirements: ('github' | 'deployedUrl' | 'screenshot' | 'textExplanation')[];
  estimatedHours: number;
  starterCodeUrl?: string;
}

const memorySubmissions: any[] = [];

export class ProjectsService {
  private fallbackProjects: RawProject[] = [];

  constructor() {
    this.loadFallbackSeeds();
  }

  private loadFallbackSeeds() {
    try {
      const seedsDir = path.resolve(process.cwd(), '../data/seeds');
      const localSeedsDir = path.resolve(process.cwd(), 'data/seeds');
      const targetDir = fs.existsSync(seedsDir) ? seedsDir : localSeedsDir;
      const projPath = path.join(targetDir, 'projects.json');
      if (fs.existsSync(projPath)) {
        this.fallbackProjects = JSON.parse(fs.readFileSync(projPath, 'utf-8'));
      }
    } catch {
      // Defaults
    }
  }

  async getAllProjects(query?: ProjectQuery): Promise<RawProject[]> {
    if (isDbConnected()) {
      const filter: any = {};
      if (query?.skillSlug) filter.skillSlugs = query.skillSlug;
      if (query?.difficulty) filter.difficulty = query.difficulty;
      if (query?.search) {
        filter.$or = [
          { title: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } },
        ];
      }
      const projects = await Project.find(filter);
      if (projects.length > 0) {
        return projects.map((p) => p.toJSON());
      }
    }

    let list = [...this.fallbackProjects];
    if (query?.skillSlug) {
      list = list.filter((p) => p.skillSlugs.includes(query.skillSlug!));
    }
    if (query?.difficulty) {
      list = list.filter((p) => p.difficulty === query.difficulty);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }

  async getProjectBySlug(slug: string): Promise<RawProject> {
    if (isDbConnected()) {
      const project = await Project.findOne({ slug });
      if (project) return project.toJSON();
    }

    const fallback = this.fallbackProjects.find((p) => p.slug === slug);
    if (fallback) return fallback;

    throw new AppError(`Project checkpoint not found with slug: ${slug}`, 404);
  }

  async findBestProjectForSkill(skillSlug: string): Promise<RawProject | null> {
    const all = await this.getAllProjects();
    const matched = all.filter((p) => p.skillSlugs.includes(skillSlug));
    if (matched.length > 0) {
      return matched[0];
    }
    return null;
  }

  async submitEvidence(
    projectId: string,
    learnerId: string | undefined,
    data: ProjectSubmissionInput
  ): Promise<any> {
    if (isDbConnected()) {
      const submission = await ProjectSubmission.create({
        projectId,
        learnerId,
        pathwayId: data.pathwayId,
        evidence: data.evidence,
        notes: data.notes,
        status: 'submitted',
      });
      return submission.toJSON();
    }

    const mockSubmission = {
      id: `sub-${Date.now()}`,
      projectId,
      learnerId,
      pathwayId: data.pathwayId,
      evidence: data.evidence,
      notes: data.notes,
      status: 'submitted',
      submittedAt: new Date(),
    };
    memorySubmissions.push(mockSubmission);
    return mockSubmission;
  }
}

export const projectsService = new ProjectsService();
