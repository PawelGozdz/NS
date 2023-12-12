import config from '@config/app';
import {
	CannotCreateUserError,
	ConflictError,
	CreateUserIntegrationEvent,
	GetUserByEmailIntegrationEvent,
	GetUserByIdIntegrationEvent,
	IUser,
	SignInDto,
	SignUpDto,
	UnauthorizedError,
	UpdateUserIntegrationEvent,
} from '@libs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { ITokens } from '../types';
import { HashService } from './hash.service';

interface IUserInfo {
	id: string;
	email: string;
	roleId: string;
	hash: string;
	hashedRt: string | null;
}

interface IUserCreated {
	id?: string;
}

@Injectable()
export class AuthService {
	constructor(
		private eventEmitter: EventEmitter2,
		private readonly jwtService: JwtService,
		private readonly hashService: HashService,
	) {}
	public async createUser(dto: SignUpDto): Promise<{ id: string }> {
		try {
			const hash = await this.hashService.hashData(dto.password);

			const user = (await this.eventEmitter.emitAsync(
				CreateUserIntegrationEvent.eventName,
				new CreateUserIntegrationEvent({
					email: dto.email,
					hash,
					roleId: dto.roleId,
					hashedRt: null,
				}),
			)) as IUserCreated[];

			if (!user[0]?.id) {
				throw CannotCreateUserError.failed();
			}

			return {
				id: user[0].id,
			};
		} catch (error: any) {
			if (error.code === 'P2002') {
				throw new ConflictError(`User with this email already exists!`);
			}
			throw error;
		}
	}

	public async getUserById(userId: string): Promise<IUserInfo | undefined> {
		const user = await this.eventEmitter.emitAsync(GetUserByIdIntegrationEvent.eventName, new GetUserByIdIntegrationEvent(userId));

		return user[0];
	}

	public async getUserByEmail(email: string): Promise<IUserInfo | undefined> {
		const user = await this.eventEmitter.emitAsync(GetUserByEmailIntegrationEvent.eventName, new GetUserByEmailIntegrationEvent(email));

		return user[0];
	}

	public async updateUser(user: Partial<IUser> & { id: string }): Promise<void> {
		try {
			await this.eventEmitter.emitAsync(
				UpdateUserIntegrationEvent.eventName,
				new UpdateUserIntegrationEvent({
					hash: user.hash,
					id: user.id,
					hashedRt: user.hashedRt,
					email: user.email,
					roleId: user.roleId,
				}),
			);
		} catch (error: any) {
			if (error.code === 'P2002') {
				throw new ConflictError(`User with this email already exists!`);
			}
			throw error;
		}
	}

	public async signup(userId: string): Promise<ITokens> {
		const tokens = await this.getTokens(userId);
		const hashedPassword = await this.updateHash(tokens.refresh_token);

		await this.updateUser({
			id: userId,
			hash: hashedPassword,
		});

		return tokens;
	}

	public async signin(dto: SignInDto, user: IUser): Promise<ITokens> {
		if (!user) {
			throw new UnauthorizedError(`Invalid credentials`);
		}
		const passwordMatch = await this.verifyTextToHash(user.hash, dto.password);

		if (!passwordMatch) {
			throw new UnauthorizedError(`Invalid credentials`);
		}
		const tokens = await this.getTokens(user.id);

		const hashedRToken = await this.updateHash(tokens.refresh_token);

		await this.updateUser({
			...user,
			hashedRt: hashedRToken,
		});

		return tokens;
	}

	public async getAuthenticatedUserWithEmailAndPassword(email: string, password: string): Promise<IUser> {
		if (!password || typeof password !== 'string' || !email || typeof email !== 'string') {
			throw new UnauthorizedError(`Invalid credentials`);
		}

		const user = await this.getUserByEmail(email);

		if (!user) {
			throw new UnauthorizedError(`Invalid credentials`);
		}

		const passwordMatch = await this.verifyTextToHash(user.hash, password);

		if (!passwordMatch) {
			throw new UnauthorizedError(`Invalid credentials`);
		}

		return user;
	}

	public async getAuthenticatedUserWithJwt(userId: string): Promise<IUser> {
		if (!userId || typeof userId !== 'string') {
			throw new UnauthorizedError(`Invalid credentials`);
		}

		const user = await this.getUserById(userId);

		if (user) {
			return user;
		}

		throw new UnauthorizedError(`Invalid credentials`);
	}

	public async getAuthenticatedUserWithRefreshToken(userId: string, token: string): Promise<IUser> {
		if (!userId || typeof userId !== 'string' || !token || typeof token !== 'string') {
			throw new UnauthorizedError(`Invalid credentials`);
		}

		const user = await this.getUserById(userId);

		if (!user || !user.hashedRt) {
			throw new UnauthorizedError(`Invalid credentials`);
		}

		const isAuth = await this.hashService.hashAndTextVerify(user.hashedRt!, token);

		if (isAuth) {
			return user;
		}

		throw new UnauthorizedError(`Invalid credentials`);
	}

	public async logout(userId: string): Promise<void> {
		await this.updateUser({
			id: userId,
			hashedRt: null,
		});
	}

	public async refreshTokens(user: IUser, refreshToken: string): Promise<ITokens> {
		if (!user || !user.hashedRt || !refreshToken || typeof refreshToken !== 'string') {
			throw new UnauthorizedError(`Invalid credentials`);
		}

		const refreshTokenMatches = await this.hashService.hashAndTextVerify(user.hashedRt, refreshToken);

		if (!refreshTokenMatches) {
			throw new UnauthorizedError(`Invalid credentials`);
		}

		const tokens = await this.getTokens(user.id);
		const hashedRToken = await this.updateHash(tokens.refresh_token);

		await this.updateUser({
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
}
