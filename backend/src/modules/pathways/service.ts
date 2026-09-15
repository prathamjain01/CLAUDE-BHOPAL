import crypto from 'crypto';
import { LearningPath, ILearningPath, IPathwayStep } from './model.js';
import { GeneratePathwayInput, ReplanPathwayInput } from './schema.js';
import { learnerService } from '../learner/service.js';
import { skillsService } from '../skills/service.js';
import { resourcesService } from '../resources/service.js';
import { projectsService } from '../projects/service.js';
import { aiService } from '../../ai/service.js';
import { AppError } from '../../utils/apiResponse.js';
import { isDbConnected } from '../../config/db.js';

const memoryPathways = new Map<string, any>();

export class PathwaysService {
  async generatePathway(
    userId: string | undefined,
    input: GeneratePathwayInput
  ): Promise<any> {
    // 1. Gather learner profile context
    let profile: any = null;
    if (input.learnerProfileId) {
      profile = await learnerService.getProfileById(input.learnerProfileId);
    } else if (userId) {
      try {
        profile = await learnerService.getProfile(userId);
      } catch {
        // No saved profile yet
      }
    } else if (input.sessionId) {
      try {
        profile = await learnerService.getProfile(undefined, input.sessionId);
      } catch {
        // No saved profile
      }
    }

    const goal = input.goal || profile?.goal || 'Frontend Web Development';
    const currentSkills = input.currentSkills || profile?.currentSkills || [];
    const availableHours = input.availableHoursPerDay || profile?.availableHoursPerDay || 1;
    const device = input.device || profile?.device || 'laptop';
    const preferredLanguage = input.preferredLanguage || profile?.preferredLanguage || 'en';
    const city = input.city || profile?.city || 'Bhopal';

    // 2. Deterministic DAG resolution: identify target skills & ordered missing prerequisites
    const targetSkillSlugs = skillsService.resolveTargetSkillsForGoal(goal);
    const orderedSkills = await skillsService.resolveSkillOrder(targetSkillSlugs, currentSkills);

    if (orderedSkills.length === 0) {
      // Learner already mastered everything for this goal! Add an advanced step
      const allSkills = await skillsService.getAllSkills();
      const advancedSkills = allSkills.filter((s) => s.level === 'intermediate' || s.level === 'advanced');
      orderedSkills.push(advancedSkills[0] || allSkills[0]);
    }

    // 3. Match free resources and mini-projects per step
    const stepsDraft: Array<{
      skill: (typeof orderedSkills)[0];
      resource: any;
      project: any;
      estimatedDays: number;
    }> = [];

    let totalDays = 0;
    for (let i = 0; i < orderedSkills.length; i++) {
      const skill = orderedSkills[i];
      const matchedRes = await resourcesService.findBestResourceForSkill(skill.slug, {
        preferredLanguage,
        device,
      });
      const matchedProj = await projectsService.findBestProjectForSkill(skill.slug);

      const skillHours = skill.estimatedHours || 10;
      const daysForStep = Math.max(2, Math.ceil(skillHours / Math.max(availableHours, 0.5)));
      totalDays += daysForStep;

      stepsDraft.push({
        skill,
        resource: matchedRes,
        project: matchedProj,
        estimatedDays: daysForStep,
      });
    }

    // 4. AI reasoning layer for personal rationale, pacing, and encouragement
    const aiExplanation = await aiService.explainPathway(
      {
        goal,
        currentSkills,
        availableHoursPerDay: availableHours,
        device,
        preferredLanguage,
        city,
      },
      stepsDraft.map((d) => ({
        skillSlug: d.skill.slug,
        skillName: d.skill.name,
        prerequisites: [],
        resourceTitle: d.resource?.title,
        projectTitle: d.project?.title,
      }))
    );

    // 5. Build structured steps array
    const steps: IPathwayStep[] = stepsDraft.map((d, index) => {
      const stepExplanation = aiExplanation.stepExplanations.find((e) => e.skillSlug === d.skill.slug);
      return {
        stepId: `step_${index + 1}`,
        skillSlug: d.skill.slug,
        skillName: d.skill.name,
        category: d.skill.category,
        reason:
          stepExplanation?.whyNeeded ||
          (index === 0
            ? `Fundamental foundation for ${goal}`
            : `Prerequisite step to develop real competency in ${d.skill.name}`),
        beginnerTip:
          stepExplanation?.beginnerTip ||
          'Practice by building small code snippets daily alongside the lessons.',
        estimatedDays: d.estimatedDays,
        resource: {
          title: d.resource?.title || `${d.skill.name} Curated Guide`,
          url: d.resource?.url || 'https://developer.mozilla.org',
          provider: d.resource?.provider || 'Curated Open Education',
          cost: 'free',
          mobileFriendly: d.resource ? d.resource.mobileFriendly : true,
          language: d.resource?.language || preferredLanguage,
          durationHours: d.resource?.durationHours || 6,
        },
        project: d.project
          ? {
              slug: d.project.slug,
              title: d.project.title,
              description: d.project.description,
              acceptanceCriteria: d.project.acceptanceCriteria,
              evidenceRequirements: d.project.evidenceRequirements,
              estimatedHours: d.project.estimatedHours,
            }
          : undefined,
        status: index === 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
      };
    });

    const shareId = `path_${crypto.randomBytes(4).toString('hex')}`;
    const pathwayTitle = `Path to ${goal} (${city})`;

    if (isDbConnected()) {
      const pathway = await LearningPath.create({
        shareId,
        learnerProfileId: profile?._id,
        userId,
        sessionId: input.sessionId,
        goal,
        title: pathwayTitle,
        overview: aiExplanation.overview,
        encouragementMessage: aiExplanation.encouragementMessage,
        totalEstimatedDays: totalDays,
        status: 'ACTIVE',
        currentStepIndex: 0,
        steps,
      });

      return pathway.toJSON();
    }

    // In-memory fallback
    const mockPathway = {
      id: `pathway-${Date.now()}`,
      shareId,
      learnerProfileId: profile?.id,
      userId,
      sessionId: input.sessionId,
      goal,
      title: pathwayTitle,
      overview: aiExplanation.overview,
      encouragementMessage: aiExplanation.encouragementMessage,
      totalEstimatedDays: totalDays,
      status: 'ACTIVE',
      currentStepIndex: 0,
      steps,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryPathways.set(mockPathway.id, mockPathway);
    memoryPathways.set(shareId, mockPathway);

    return mockPathway;
  }

  async getPathwayByIdOrShare(idOrShare: string): Promise<any> {
    if (isDbConnected()) {
      let pathway: ILearningPath | null = null;
      if (idOrShare.startsWith('path_')) {
        pathway = await LearningPath.findOne({ shareId: idOrShare });
      } else {
        pathway = await LearningPath.findById(idOrShare).catch(() => null);
        if (!pathway) {
          pathway = await LearningPath.findOne({ shareId: idOrShare });
        }
      }
      if (pathway) return pathway.toJSON();
    }

    if (memoryPathways.has(idOrShare)) {
      return memoryPathways.get(idOrShare);
    }

    for (const p of memoryPathways.values()) {
      if (p.id === idOrShare || p.shareId === idOrShare) {
        return p;
      }
    }

    throw new AppError(`Pathway not found: ${idOrShare}`, 404);
  }

  async replanPathway(id: string, input: ReplanPathwayInput): Promise<any> {
    const pathway = await this.getPathwayByIdOrShare(id);
    if (!pathway) {
      throw new AppError('Pathway not found', 404);
    }

    const completedStepSlugs = pathway.steps
      .filter((s: IPathwayStep) => s.status === 'COMPLETED')
      .map((s: IPathwayStep) => s.skillSlug);

    const remainingSteps = pathway.steps
      .filter((s: IPathwayStep) => s.status !== 'COMPLETED')
      .map((s: IPathwayStep) => s.skillName);

    // Call AI replanning service
    const replanAdvice = await aiService.explainReplan(
      {
        goal: input.newGoal || pathway.goal,
        availableHoursPerDay: input.newAvailableHoursPerDay || 1,
      },
      {
        completedSteps: completedStepSlugs,
        currentBlockedStep: input.blockedStepId,
        learnerFeedback: input.feedback,
        remainingSteps,
      }
    );

    // Update steps based on trigger
    if (input.trigger === 'BLOCKED' && input.blockedStepId) {
      const step = pathway.steps.find((s: IPathwayStep) => s.stepId === input.blockedStepId);
      if (step) {
        step.status = 'BLOCKED';
        step.notes = `Learner reported difficulty: ${input.feedback}`;
      }
    }

    if (input.newAvailableHoursPerDay) {
      const newHours = input.newAvailableHoursPerDay;
      for (const s of pathway.steps) {
        if (s.status !== 'COMPLETED') {
          s.estimatedDays = Math.max(2, Math.round(s.estimatedDays * (1 / newHours)));
        }
      }
    }

    pathway.encouragementMessage = replanAdvice.encouragement;
    pathway.overview = `${pathway.overview}\n\n[Adjustment]: ${replanAdvice.summaryOfChanges}`;
    pathway.updatedAt = new Date();

    if (isDbConnected()) {
      await LearningPath.findByIdAndUpdate(pathway.id || id, pathway);
    } else {
      memoryPathways.set(id, pathway);
      if (pathway.shareId) memoryPathways.set(pathway.shareId, pathway);
    }

    return {
      pathway,
      replanAdvice,
    };
  }

  async getShareableSummary(idOrShare: string): Promise<any> {
    const pathway = await this.getPathwayByIdOrShare(idOrShare);
    const totalSteps = pathway.steps.length;
    const completedCount = pathway.steps.filter((s: any) => s.status === 'COMPLETED').length;
    const progressPercentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    const currentStep = pathway.steps.find((s: any) => s.status === 'IN_PROGRESS') || pathway.steps[0];
    const completedSteps = pathway.steps.filter((s: any) => s.status === 'COMPLETED');
    const upcomingSteps = pathway.steps.filter((s: any) => s.status === 'NOT_STARTED');

    return {
      shareId: pathway.shareId,
      goal: pathway.goal,
      title: pathway.title,
      overview: pathway.overview,
      encouragementMessage: pathway.encouragementMessage,
      progressPercentage,
      totalEstimatedDays: pathway.totalEstimatedDays,
      currentStep,
      completedSteps,
      upcomingSteps,
      projects: pathway.steps.filter((s: any) => s.project).map((s: any) => s.project),
      mentorReviewUrl: `/share/${pathway.shareId}`,
    };
  }
}

export const pathwaysService = new PathwaysService();
