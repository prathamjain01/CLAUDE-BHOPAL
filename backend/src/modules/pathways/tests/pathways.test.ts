import { pathwaysService } from '../service.js';

describe('Pathways Service', () => {
  it('should generate an ordered learning pathway from learner profile', async () => {
    const pathway = await pathwaysService.generatePathway(undefined, {
      goal: 'Frontend Web Development',
      currentSkills: ['html-basics', 'css-basics'],
      availableHoursPerDay: 1,
      device: 'laptop',
      preferredLanguage: 'en',
      city: 'Bhopal',
    });

    expect(pathway).toBeDefined();
    expect(pathway.shareId).toBeDefined();
    expect(pathway.steps.length).toBeGreaterThan(0);
    // Should start with JavaScript since HTML/CSS are mastered
    expect(pathway.steps[0].skillSlug).toBe('javascript-fundamentals');
    expect(pathway.steps[0].status).toBe('IN_PROGRESS');
    expect(pathway.steps[0].resource).toBeDefined();
    expect(pathway.steps[0].resource.url).toMatch(/^https?:\/\//);
  });

  it('should retrieve pathway by shareId for mentor review', async () => {
    const created = await pathwaysService.generatePathway(undefined, {
      goal: 'Fullstack MERN',
      currentSkills: [],
      availableHoursPerDay: 2,
    });

    const summary = await pathwaysService.getShareableSummary(created.shareId);
    expect(summary).toBeDefined();
    expect(summary.shareId).toBe(created.shareId);
    expect(summary.goal).toBe('Fullstack MERN');
    expect(summary.mentorReviewUrl).toContain(created.shareId);
  });

  it('should replan pathway when learner reports difficulty', async () => {
    const created = await pathwaysService.generatePathway(undefined, {
      goal: 'Frontend Web Development',
      currentSkills: ['html-basics'],
      availableHoursPerDay: 1,
    });

    const replanned = await pathwaysService.replanPathway(created.id, {
      trigger: 'BLOCKED',
      feedback: 'Struggling with JavaScript loops and DOM manipulation',
      blockedStepId: created.steps[0].stepId,
    });

    expect(replanned.pathway).toBeDefined();
    expect(replanned.replanAdvice).toBeDefined();
    expect(replanned.replanAdvice.summaryOfChanges).toBeDefined();
  });
});
