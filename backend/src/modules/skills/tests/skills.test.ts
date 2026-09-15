import { skillsService } from '../service.js';

describe('Skills Service & Deterministic DAG Engine', () => {
  it('should retrieve all skills from the catalogue', async () => {
    const skills = await skillsService.getAllSkills();
    expect(skills.length).toBeGreaterThan(0);
    const slugs = skills.map((s) => s.slug);
    expect(slugs).toContain('html-basics');
    expect(slugs).toContain('javascript-fundamentals');
    expect(slugs).toContain('react-basics');
  });

  it('should deterministically resolve target skills for a given goal', () => {
    const frontendSkills = skillsService.resolveTargetSkillsForGoal('Frontend Web Development');
    expect(frontendSkills).toContain('html-basics');
    expect(frontendSkills).toContain('react-basics');

    const backendSkills = skillsService.resolveTargetSkillsForGoal('Backend API development');
    expect(backendSkills).toContain('nodejs-express');
    expect(backendSkills).toContain('mongodb-basics');
  });

  it('should topological-sort prerequisites so dependencies appear before dependent skills', async () => {
    const ordered = await skillsService.resolveSkillOrder(['react-basics'], []);
    const slugs = ordered.map((s) => s.slug);

    const htmlIdx = slugs.indexOf('html-basics');
    const cssIdx = slugs.indexOf('css-basics');
    const jsIdx = slugs.indexOf('javascript-fundamentals');
    const reactIdx = slugs.indexOf('react-basics');

    expect(htmlIdx).toBeLessThan(jsIdx);
    expect(cssIdx).toBeLessThan(jsIdx);
    expect(jsIdx).toBeLessThan(reactIdx);
  });

  it('should omit skills the learner has already mastered', async () => {
    const ordered = await skillsService.resolveSkillOrder(
      ['react-basics'],
      ['html-basics', 'css-basics']
    );
    const slugs = ordered.map((s) => s.slug);

    expect(slugs).not.toContain('html-basics');
    expect(slugs).not.toContain('css-basics');
    expect(slugs).toContain('javascript-fundamentals');
    expect(slugs).toContain('react-basics');
  });

  it('should produce an accurate assessment snapshot (mastered, next, later)', async () => {
    const assessment = await skillsService.evaluateAssessment({
      goal: 'Frontend Web Development',
      currentSkills: ['html-basics', 'css-basics'],
    });

    expect(assessment.goal).toBe('Frontend Web Development');
    expect(assessment.mastered.map((s) => s.slug)).toEqual(['html-basics', 'css-basics']);
    expect(assessment.next.length).toBe(1);
    expect(assessment.next[0].slug).toBe('javascript-fundamentals');
    expect(assessment.later.length).toBeGreaterThan(0);
  });
});
