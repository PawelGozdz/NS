import * as jwt from 'jsonwebtoken';
import { testingDefaults } from './constants';

export class AuthenticationServer {
	private secret: string = testingDefaults.secret;
	private refreshSecret: string = testingDefaults.refreshSecret;
	public userId = testingDefaults.userId;
	private accessTokenExpirationTime = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '2m';
	private refreshTokenExpirationTime = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '15m';

	constructor(
		props: {
			secret?: string;
			refreshSecret?: string;
			userId?: string;
			accessTokenExpirationTime?: string;
			refreshTokenExpirationTime?: string;
		} = {},
	) {
		this.secret = props.secret || process.env.JWT_ACCESS_TOKEN_SECRET || this.secret;
		this.refreshSecret = props.refreshSecret || process.env.JWT_REFRESH_TOKEN_SECRET || this.refreshSecret;
		this.userId = props.userId || process.env.JWT_USER_ID || this.userId;
		this.accessTokenExpirationTime =
			props.accessTokenExpirationTime || process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || this.accessTokenExpirationTime;
		this.refreshTokenExpirationTime =
			props.refreshTokenExpirationTime || process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || this.refreshTokenExpirationTime;
	}

	getTestingUserId(): string {
		return this.userId;
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
