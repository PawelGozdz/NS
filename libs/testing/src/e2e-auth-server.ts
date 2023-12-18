import * as jwt from 'jsonwebtoken';

export class AuthenticationServer {
	private secret: string = 'secret';
	private refreshSecret: string = 'refreshSecret';
	public userId = 'a6185a9f-8873-4f1b-b630-3729318bc636';
	private accessTokenExpirationTime = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '2m';
	private refreshTokenExpirationTime = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '15m';

	constructor() {
		this.secret = process.env.JWT_ACCESS_TOKEN_SECRET || this.secret;
		this.refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET || this.refreshSecret;
	}

	generateAccessToken(userId: string = this.userId): string {
		const payload = { id: userId };
		const token = jwt.sign(payload, this.secret, { expiresIn: this.accessTokenExpirationTime });

		return token;
	}

	generateRefreshToken(userId: string = this.userId): string {
		const payload = { id: userId };
		const token = jwt.sign(payload, this.refreshSecret, { expiresIn: this.refreshTokenExpirationTime });

		return token;
	}

	getAccessTokenAsHeader(): { Authorization: string } {
		const token = this.generateAccessToken();
		return { Authorization: `Bearer ${token}` };
	}

	getAccessTokenAsCookie(): [string, string] {
		const token = this.generateAccessToken();
		return ['Cookie', `Authentication=${token}`];
	}

	getRefreshTokenAsHeader(): { 'Refresh-Token': string } {
		const token = this.generateRefreshToken();
		return { 'Refresh-Token': `Bearer ${token}` };
	}

	getRefreshTokenAsCookie(): [string, string] {
		const token = this.generateRefreshToken();
		return ['Cookie', `Refresh=${token}`];
	}

	getTokensAsCookie(): [string, string] {
		const accessToken = this.generateAccessToken();
		const refreshToken = this.generateRefreshToken();
		return ['Cookie', `Authentication=${accessToken}; Refresh=${refreshToken}`];
	}
}
