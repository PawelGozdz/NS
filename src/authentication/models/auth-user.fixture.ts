import { v4 as uuidv4 } from 'uuid';
import { AuthUser } from './authentication.dao';

export class AuthUserFixture {
	static create(optional?: { id?: string; userId?: string; email?: string; hash?: string; hashedRt?: string }) {
		const id = optional?.id ?? uuidv4();
		const userId = optional?.userId ?? uuidv4();
		const email = optional?.email ?? 'test@email.com';
		const hash = optional?.hash ?? 'hashedPassword';
		const hashedRt = optional?.hashedRt ?? 'hashedRefreshToken';

		return AuthUser.create({
			id,
			userId,
			email,
			hash,
			hashedRt,
		});
	}
}
