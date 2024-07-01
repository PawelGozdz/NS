import { Injectable } from '@nestjs/common';

import { AuthUser } from '../models';
import { IAuthUsersRepository } from '../repositories';

interface IUserCreated {
  id: string;
}

@Injectable()
export class AuthUsersService {
  constructor(private readonly authUsersRepository: IAuthUsersRepository) {}

  async create(userData: AuthUser): Promise<IUserCreated> {
    return this.authUsersRepository.create({
      id: userData.id,
      email: userData.email,
      hash: userData.hash,
      hashedRt: userData.hashedRt,
      userId: userData.userId,
      lastLogin: userData.lastLogin,
      tokenRefreshedAt: userData.tokenRefreshedAt,
    });
  }

  async update(userData: Partial<AuthUser> & { userId: string }): Promise<void> {
    await this.authUsersRepository.update(userData);
  }

  async delete(userId: string): Promise<void> {
    return this.authUsersRepository.delete(userId);
  }

  async getByUserId(userId: string): Promise<AuthUser | undefined> {
    return this.authUsersRepository.getByUserId(userId);
  }

  async getByUserEmail(email: string): Promise<AuthUser | undefined> {
    return this.authUsersRepository.getByUserEmail(email);
  }
}
