import { AppUtils } from '@libs/common';

import { AuthUser } from './authentication.model';

export class AuthUserFixture {
  static create(optional?: {
    id?: string;
    userId?: string;
    email?: string;
    hash?: string;
    hashedRt?: string;
    tokenRefreshedAt?: Date | null;
    lastLogin?: Date | null;
  }) {
    const id = optional?.id ?? AppUtils.getUUID();
    const userId = optional?.userId ?? AppUtils.getUUID();
    const email = optional?.email ?? 'test@email.com';
    const hash = optional?.hash ?? 'hashedPassword';
    const hashedRt = optional?.hashedRt ?? 'hashedRefreshToken';
    const tokenRefreshedAt = optional?.tokenRefreshedAt ?? new Date();
    const lastLogin = optional?.lastLogin ?? new Date();

    return AuthUser.create({
      id,
      userId,
      email,
      hash,
      hashedRt,
      tokenRefreshedAt,
      lastLogin,
    });
  }
}
