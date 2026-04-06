import { Prisma, type Role as PrismaRole, type User as PrismaUser } from '@prisma/client';
import type { Role } from '../constants/roles.js';
import type { User } from '../domain/models.js';
import { prisma } from '../lib/prisma.js';

interface CreateUserInput {
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
}

interface UpdateUserInput {
  name?: string;
  role?: Role;
  isActive?: boolean;
}

export class UserRepository {
  async list(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(mapUser);
  }

  async findById(userId: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user ? mapUser(user) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    return user ? mapUser(user) : undefined;
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        role: input.role as PrismaRole,
        isActive: input.isActive ?? true,
      },
    });

    return mapUser(user);
  }

  async update(userId: string, input: UpdateUserInput): Promise<User | undefined> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.role !== undefined ? { role: input.role as PrismaRole } : {}),
          ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        },
      });

      return mapUser(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return undefined;
      }
      throw error;
    }
  }
}

export const userRepository = new UserRepository();

const mapUser = (user: PrismaUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role as Role,
  isActive: user.isActive,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
