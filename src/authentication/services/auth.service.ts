import config from '@config/app';
import { ConflictError, EntityId, SignInDto, SignUpDto, UnauthorizedError } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
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
		try {
			const hash = await this.hashService.hashData(dto.password);

			const userCreated = await this.authUsersService.createIntegrationUser(dto);

			const buildUserObj = AuthUser.create({
				userId: userCreated.id!,
				hash,
				email: dto.email,
				hashedRt: null,
			});

			await this.authUsersService.create(buildUserObj);

			return buildUserObj;
		} catch (error: any) {
			if (error.code === 'P2002') {
				throw new ConflictError(`User with this email already exists!`);
			}
			throw error;
		}
	}

	public async signup(userId: EntityId): Promise<ITokens> {
		const tokens = await this.getTokens(userId.value);
		const hashedPassword = await this.updateHash(tokens.refresh_token);

		await this.authUsersService.update({
			id: userId,
			hash: hashedPassword,
		});

		return tokens;
	}

	public async signin(dto: SignInDto, user: AuthUser): Promise<ITokens> {
		const passwordMatch = await this.verifyTextToHash(user.hash, dto.password);

		if (!passwordMatch) {
			throw new UnauthorizedError(`Invalid credentials`);
		}
		const tokens = await this.getTokens(user.userId.value);

		const hashedRToken = await this.updateHash(tokens.refresh_token);

		await this.authUsersService.update({
			...user,
			hashedRt: hashedRToken,
		});

		return tokens;
	}

	public async getAuthenticatedUserWithEmailAndPassword(email: string, password: string): Promise<AuthUser> {
		this.isCorrectString(email, password);

		const user = await this.authUsersService.getByUserEmail(email);

		if (!user) {
			this.logger.warn(`User with email ${email} not found`);
			throw new UnauthorizedError(`Invalid credentials`);
		}

		const passwordMatch = await this.verifyTextToHash(user.hash, password);

		if (!passwordMatch) {
			this.logger.warn(`User password with email ${email} is incorrect`);
			throw new UnauthorizedError(`Invalid credentials`);
		}

		return user;
	}

	public async getAuthenticatedUserWithJwt(userId: EntityId): Promise<AuthUser> {
		this.isCorrectString(userId.value);

		const user = await this.authUsersService.getByUserId(userId);

		if (user) {
			return user;
		}

		throw new UnauthorizedError(`Invalid credentials`);
	}

	public async getAuthenticatedUserWithRefreshToken(userId: EntityId, token: string): Promise<AuthUser> {
		this.isCorrectString(userId.value, token);

		const user = await this.authUsersService.getByUserId(userId);

		if (!user || !user.hashedRt) {
			throw new UnauthorizedError(`Invalid credentials`);
		}

		const isAuth = await this.hashService.hashAndTextVerify(user.hashedRt!, token);

		if (isAuth) {
			return user;
		}

		throw new UnauthorizedError(`Invalid credentials`);
	}

	public async logout(userId: EntityId): Promise<void> {
		await this.authUsersService.update({
			id: userId,
			hashedRt: null,
		});
	}

	public async refreshTokens(user: AuthUser, refreshToken: string): Promise<ITokens> {
		this.isCorrectString(user.hashedRt!, refreshToken);

		const refreshTokenMatches = await this.hashService.hashAndTextVerify(user.hashedRt!, refreshToken);

		if (!refreshTokenMatches) {
			throw new UnauthorizedError(`Invalid credentials`);
		}

		const tokens = await this.getTokens(user.userId.value);
		const hashedRToken = await this.updateHash(tokens.refresh_token);

		await this.authUsersService.update({
			...user,
			hashedRt: hashedRToken,
		});

		return tokens;
	}

	// Utitlities
	public async verifyTextToHash(hash: string, password: string): Promise<boolean> {
		const passwordMatches = await this.hashService.hashAndTextVerify(hash, password);

		if (typeof passwordMatches !== 'boolean') {
			throw new UnauthorizedError(`Invalid credentials`);
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
		return await this.hashService.hashData(text);
	}

	isCorrectString(...texts: (string | string[])[]) {
		const arr = Array.isArray(texts) ? texts : [texts];
		for (const text of arr) {
			if (!text || typeof text !== 'string' || (typeof text === 'string' && !text.trim())) {
				throw new UnauthorizedError(`Invalid credentials`);
			}
		}
	}
}
