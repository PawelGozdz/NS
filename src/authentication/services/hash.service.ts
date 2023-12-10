import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class HashService {
	public async verifyPassword(hash: string, password: string): Promise<boolean> {
		return await this.hashAndTextVerify(hash, password);
	}

	public async hashData(data: string): Promise<string> {
		return await argon2.hash(data, { timeCost: 6 });
	}

	public async hashAndTextVerify(hash: string, text: any): Promise<boolean> {
		if (!hash || !text) return false;

		return await argon2.verify(hash, text);
	}
}
