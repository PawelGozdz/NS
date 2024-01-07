import { AuthUser } from '../models';

export abstract class IAuthUsersRepository {
	abstract create(user: AuthUser): Promise<{ id: string }>;
	abstract update(user: Partial<AuthUser>): Promise<void>;
	abstract delete(userId: string): Promise<void>;
	abstract getByUserId(id: string): Promise<AuthUser | undefined>;
	abstract getByUserEmail(email: string): Promise<AuthUser | undefined>;
}
