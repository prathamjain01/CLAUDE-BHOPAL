import { learnerService } from '../service.js';

describe('Learner Profile Service', () => {
  const sessionId = `test-session-${Date.now()}`;

  it('should save learner intake profile for guest learner', async () => {
    const profile = await learnerService.saveProfile(undefined, sessionId, {
      goal: 'Frontend Web Developer',
      currentSkills: ['html-basics'],
      availableHoursPerDay: 1.5,
      device: 'laptop',
      internetQuality: 'mobile_data_limited',
      preferredLanguage: 'hi',
      city: 'Bhopal',
      priorExposure: 'Basic computer usage',
    });

    expect(profile).toBeDefined();
    expect(profile.goal).toBe('Frontend Web Developer');
    expect(profile.availableHoursPerDay).toBe(1.5);
    expect(profile.city).toBe('Bhopal');
  });

  it('should retrieve existing profile by sessionId', async () => {
    const profile = await learnerService.getProfile(undefined, sessionId);
    expect(profile).toBeDefined();
    expect(profile.city).toBe('Bhopal');
  });

  it('should update learner profile fields', async () => {
    const profile = await learnerService.getProfile(undefined, sessionId);
    const updated = await learnerService.updateProfile(profile.id, {
      availableHoursPerDay: 2,
    });
    expect(updated.availableHoursPerDay).toBe(2);
  });
});
