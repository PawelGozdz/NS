import config from '@app/config/app';
import { ConflictError, UnauthorizedError } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';

import { SignInDto, SignUpDto } from '../dtos';
import { AuthUser } from '../models';
import { ITokens } from '../types';
import { AuthUsersService } from './auth-users.service';
import { HashService } from './hash.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly hashService: HashService,
		private readonly authUsersService: AuthUsersService,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(this.constructor.name);
	}

	public async createUser(dto: SignUpDto): Promise<AuthUser> {
		this.logger.info(dto, 'Creating user');
		try {
			const hash = await this.hashService.hashData(dto.password);

			const integrationUser = await this.authUsersService.createIntegrationUser(dto);

			const buildUserObj = AuthUser.create({
				userId: integrationUser.id,
				hash,
				email: dto.email,
				hashedRt: null,
			});

			await this.authUsersService.create(buildUserObj);

			return buildUserObj;
		} catch (error: any) {
			if (error.code === 'P2002') {
				throw new ConflictError('User with this email already exists!');
			}
			throw error;
		}
	}

	public async signup(userId: string): Promise<ITokens> {
		this.logger.info({ userId }, 'Signing up user');

		const tokens = await this.getTokens(userId);
		const hashedRt = await this.updateHash(tokens.refresh_token);

		const date = new Date();

		await this.authUsersService.update({
			userId,
			hashedRt,
			lastLogin: date,
			tokenRefreshedAt: date,
		});

		return tokens;
	}

	public async signin(dto: SignInDto, user: AuthUser): Promise<ITokens> {
		this.logger.info({ dto, user }, 'Signing up user');

		const passwordMatch = await this.verifyTextToHash(user.hash, dto.password);

		if (!passwordMatch) {
			this.logger.warn(`User password with email ${dto.email} is incorrect`);
			throw new UnauthorizedError();
		}
		const tokens = await this.getTokens(user.userId);

		const hashedRt = await this.updateHash(tokens.refresh_token);

		const date = new Date();

		await this.authUsersService.update({
			...user,
			hashedRt,
			lastLogin: date,
			tokenRefreshedAt: date,
		});

		return tokens;
	}

	public async getAuthenticatedUserWithEmailAndPassword(email: string, password: string): Promise<AuthUser> {
		this.isCorrectString(email, password);

		const user = await this.authUsersService.getByUserEmail(email);

		if (!user) {
			this.logger.warn(`User with email ${email} not found`);
			throw new UnauthorizedError();
		}

		const passwordMatch = await this.verifyTextToHash(user.hash, password);

		if (!passwordMatch) {
			this.logger.warn(`User password with email ${email} is incorrect`);
			throw new UnauthorizedError();
		}

		return user;
	}

	public async getAuthenticatedUserWithJwt(userId: string): Promise<AuthUser> {
		this.isCorrectString(userId);

		const user = await this.authUsersService.getByUserId(userId);

		if (user) {
			return user;
		}

		throw new UnauthorizedError();
	}

	public async getAuthenticatedUserWithRefreshToken(userId: string, token: string): Promise<AuthUser> {
		this.isCorrectString(userId, token);

		const user = await this.authUsersService.getByUserId(userId);

		if (!user?.hashedRt) {
			this.logger.warn(`User with id ${userId} not found`);
			throw new UnauthorizedError();
		}

		const isAuth = await this.hashService.hashAndTextVerify(user.hashedRt, token);

		if (isAuth) {
			return user;
		}

		throw new UnauthorizedError();
	}

	public async logout(userId: string): Promise<void> {
		this.logger.info({ userId }, 'Logging out user');

		await this.authUsersService.update({
			userId,
			hashedRt: null,
		});
	}

	public async refreshTokens(user: AuthUser, refreshToken: string): Promise<ITokens> {
		this.logger.info({ userId: user.userId }, 'Refreshing tokens');
		this.isCorrectString(user.hashedRt!, refreshToken);

		const refreshTokenMatches = await this.hashService.hashAndTextVerify(user.hashedRt!, refreshToken);

		if (!refreshTokenMatches) {
			this.logger.warn(`Refresh token for user with id ${user.userId} is invalid`);
			throw new UnauthorizedError();
		}

		const tokens = await this.getTokens(user.userId);
		const hashedRToken = await this.updateHash(tokens.refresh_token);

		await this.authUsersService.update({
			...user,
			hashedRt: hashedRToken,
			tokenRefreshedAt: new Date(),
		});

		return tokens;
	}

	// Utitlities
	public async verifyTextToHash(hash: string, password: string): Promise<boolean> {
		const passwordMatches = await this.hashService.hashAndTextVerify(hash, password);

		if (typeof passwordMatches !== 'boolean') {
			throw new UnauthorizedError();
		}

		return passwordMatches;
	}

	public async getTokens(userId: string) {
		const accessToken = this.jwtService.signAsync(
			{
				id: userId,
			},
			{
				secret: config.JWT_ACCESS_TOKEN_SECRET,
				expiresIn: config.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
			},
		);

		const refreshToken = this.jwtService.signAsync(
			{
				id: userId,
			},
			{
				secret: config.JWT_REFRESH_TOKEN_SECRET,
				expiresIn: config.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
			},
		);
		const [at, rt] = await Promise.all([accessToken, refreshToken]);
		return {
			access_token: at,
			refresh_token: rt,
		};
	}

	async updateHash(text: string) {
		return this.hashService.hashData(text);
	}

	isCorrectString(...texts: (string | string[])[]) {
		const arr = Array.isArray(texts) ? texts : [texts];
		for (const text of arr) {
			if (!text || typeof text !== 'string' || (typeof text === 'string' && !text.trim())) {
				throw new UnauthorizedError();
			}
		}
	}
}
