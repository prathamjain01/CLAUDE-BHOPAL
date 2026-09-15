import { projectsService } from '../service.js';

describe('Projects Service', () => {
  it('should retrieve curated mini-projects', async () => {
    const projects = await projectsService.getAllProjects();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].acceptanceCriteria.length).toBeGreaterThan(0);
  });

  it('should find matching project for a skill', async () => {
    const project = await projectsService.findBestProjectForSkill('javascript-fundamentals');
    expect(project).toBeDefined();
    expect(project?.skillSlugs).toContain('javascript-fundamentals');
  });

  it('should allow submitting project evidence', async () => {
    const submission = await projectsService.submitEvidence('personal-portfolio-site', 'user-123', {
      evidence: {
        githubUrl: 'https://github.com/learner/portfolio-test',
        deployedUrl: 'https://learner-portfolio.vercel.app',
        textExplanation: 'Built a responsive portfolio with Flexbox.',
      },
    });

    expect(submission).toBeDefined();
    expect(submission.status).toBe('submitted');
    expect(submission.evidence.githubUrl).toBe('https://github.com/learner/portfolio-test');
  });
});
