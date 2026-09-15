import { authService } from '../service.js';

describe('Auth Service', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Aakash Sharma',
    role: 'learner' as const,
  };

  it('should register a new learner and return a JWT token', async () => {
    const result = await authService.register(testUser);
    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testUser.email.toLowerCase());
    expect(result.user.name).toBe(testUser.name);
    expect((result.user as any).passwordHash).toBeUndefined();
  });

  it('should reject registering duplicate emails', async () => {
    await expect(authService.register(testUser)).rejects.toThrow();
  });

  it('should authenticate user with valid credentials', async () => {
    const result = await authService.login({
      email: testUser.email,
      password: testUser.password,
    });
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe(testUser.email.toLowerCase());
  });

  it('should reject login with wrong password', async () => {
    await expect(
      authService.login({
        email: testUser.email,
        password: 'wrongpassword',
      })
    ).rejects.toThrow();
  });
});
