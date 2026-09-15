import { resourcesService } from '../service.js';

describe('Resources Service', () => {
  it('should retrieve curated free resources', async () => {
    const resources = await resourcesService.getAllResources();
    expect(resources.length).toBeGreaterThan(0);
    expect(resources.every((r) => r.cost === 'free')).toBe(true);
  });

  it('should filter resources by skillSlug', async () => {
    const jsResources = await resourcesService.getAllResources({ skillSlug: 'javascript-fundamentals' });
    expect(jsResources.length).toBeGreaterThan(0);
    expect(jsResources.every((r) => r.skillSlug === 'javascript-fundamentals')).toBe(true);
  });

  it('should find best resource prioritizing Hindi when requested', async () => {
    const bestHindi = await resourcesService.findBestResourceForSkill('javascript-fundamentals', {
      preferredLanguage: 'hi',
    });
    expect(bestHindi).toBeDefined();
    expect(bestHindi?.language).toBe('hi');
  });

  it('should prioritize mobile-friendly resource for mobile-only learner', async () => {
    const bestMobile = await resourcesService.findBestResourceForSkill('html-basics', {
      device: 'mobile_only',
    });
    expect(bestMobile).toBeDefined();
    expect(bestMobile?.mobileFriendly).toBe(true);
  });
});
