import type { Role } from '../constants/roles.js';
import type { User } from '../domain/models.js';
import { userRepository } from '../repositories/userRepository.js';
import { HttpError } from '../utils/httpError.js';

interface CreateUserPayload {
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
}

interface UpdateUserPayload {
  name?: string;
  role?: Role;
  isActive?: boolean;
}

export class UserService {
  async listUsers(): Promise<User[]> {
    return userRepository.list();
  }

  async getUserById(userId: string): Promise<User> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    return user;
  }

  async createUser(payload: CreateUserPayload): Promise<User> {
    const existingUser = await userRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new HttpError(409, 'A user with this email already exists');
    }

    return userRepository.create(payload);
  }

  async updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
    const existing = await this.getUserById(userId);

    if (existing.role === 'admin' && payload.isActive === false) {
      const allUsers = await userRepository.list();
      const activeAdmins = allUsers.filter((user) => user.role === 'admin' && user.isActive);

      if (activeAdmins.length <= 1) {
        throw new HttpError(400, 'At least one active admin is required');
      }
    }

    const updatedUser = await userRepository.update(userId, payload);

    if (!updatedUser) {
      throw new HttpError(404, 'User not found');
    }

    return updatedUser;
  }

  async getActiveUserById(userId: string): Promise<User> {
    const user = await this.getUserById(userId);

    if (!user.isActive) {
      throw new HttpError(403, 'User is inactive');
    }

    return user;
  }
}

export const userService = new UserService();
