import { workMappingService } from '../service.js';

describe('Work Mapping Service', () => {
  it('should retrieve curated Tier-2 work categories with disclaimer', async () => {
    const result = await workMappingService.getAllCategories();
    expect(result.categories.length).toBeGreaterThan(0);
    expect(result.disclaimer).toBeDefined();
    expect(result.disclaimer).toContain('does not guarantee employment');
  });

  it('should filter categories by locationType (Bhopal, Indore, Remote)', async () => {
    const bhopalResult = await workMappingService.getAllCategories({ locationType: 'Bhopal' });
    expect(bhopalResult.categories.length).toBeGreaterThan(0);
    expect(bhopalResult.categories.every((c: any) => c.locationType === 'Bhopal')).toBe(true);
  });

  it('should calculate skill alignment and unlock state for learner skills', async () => {
    const result = await workMappingService.getAllCategories({
      learnerSkills: ['html-basics', 'css-basics', 'responsive-design', 'git-github'],
    });

    expect(result.mappings).toBeDefined();
    expect(result.mappings.length).toBeGreaterThan(0);
    expect(result.totalCategories).toBeGreaterThan(0);

    // Highest match percentage should be first
    const first = result.mappings[0];
    expect(first.matchPercentage).toBeGreaterThan(0);
    expect(first.matchedRequiredSkills.length).toBeGreaterThan(0);
  });
});
