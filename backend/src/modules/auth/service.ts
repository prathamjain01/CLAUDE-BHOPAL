import bcrypt from 'bcryptjs';
import { User, IUser } from './model.js';
import { RegisterInput, LoginInput } from './schema.js';
import { AppError } from '../../utils/apiResponse.js';
import { signToken } from '../../middleware/auth.js';
import { isDbConnected } from '../../config/db.js';

// In-memory mock storage for local testing when MongoDB is disconnected
const memoryUsers = new Map<string, any>();

export class AuthService {
  async register(data: RegisterInput): Promise<{ user: any; token: string }> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    if (isDbConnected()) {
      const existing = await User.findOne({ email: data.email.toLowerCase() });
      if (existing) {
        throw new AppError('An account with this email already exists', 409);
      }

      const user = await User.create({
        email: data.email.toLowerCase(),
        passwordHash,
        name: data.name,
        role: data.role || 'learner',
      });

      const token = signToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return { user: user.toJSON(), token };
    }

    // In-memory fallback
    const normalizedEmail = data.email.toLowerCase();
    if (memoryUsers.has(normalizedEmail)) {
      throw new AppError('An account with this email already exists', 409);
    }

    const mockId = `mock-user-${Date.now()}`;
    const mockUser = {
      id: mockId,
      email: normalizedEmail,
      name: data.name,
      role: data.role || 'learner',
      passwordHash,
      createdAt: new Date(),
    };
    memoryUsers.set(normalizedEmail, mockUser);

    const token = signToken({
      id: mockId,
      email: normalizedEmail,
      role: mockUser.role,
    });

    const sanitized = { ...mockUser };
    delete (sanitized as any).passwordHash;

    return { user: sanitized, token };
  }

  async login(data: LoginInput): Promise<{ user: any; token: string }> {
    const normalizedEmail = data.email.toLowerCase();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      const isMatch = await user.comparePassword(data.password);
      if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
      }

      const token = signToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return { user: user.toJSON(), token };
    }

    // In-memory fallback
    const mockUser = memoryUsers.get(normalizedEmail);
    if (!mockUser) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(data.password, mockUser.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken({
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
    });

    const sanitized = { ...mockUser };
    delete sanitized.passwordHash;

    return { user: sanitized, token };
  }

  async getProfile(userId: string): Promise<any> {
    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return user.toJSON();
    }

    for (const u of memoryUsers.values()) {
      if (u.id === userId) {
        const sanitized = { ...u };
        delete sanitized.passwordHash;
        return sanitized;
      }
    }

    throw new AppError('User not found', 404);
  }
}

export const authService = new AuthService();
