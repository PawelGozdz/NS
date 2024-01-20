import {
	BaseError,
	CannotCreateUserError,
	CreateUserIntegrationEvent,
	GetUserByEmailIntegrationEvent,
	GetUserByIdIntegrationEvent,
	IntegrationEvent,
	SignUpIntegrationDto,
} from '@libs/common';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthUser } from '../models';
import { IAuthUsersRepository } from '../repositories';

interface IUserInfo {
	id: string;
	email: string;
}

interface IUserCreated {
	id: string;
}

@Injectable()
export class AuthUsersService {
	constructor(
		private readonly authUsersRepository: IAuthUsersRepository,
		private eventEmitter: EventEmitter2,
	) {}

	async create(userData: AuthUser): Promise<IUserCreated> {
		return await this.authUsersRepository.create({
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
		return await this.authUsersRepository.delete(userId);
	}

	async getByUserId(userId: string): Promise<AuthUser | undefined> {
		return await this.authUsersRepository.getByUserId(userId);
	}

	async getByUserEmail(email: string): Promise<AuthUser | undefined> {
		return await this.authUsersRepository.getByUserEmail(email);
	}

	public async getIntegrationUserById(userId: string): Promise<IUserInfo | undefined> {
		const user = (await this.integrationCall(GetUserByIdIntegrationEvent.eventName, new GetUserByIdIntegrationEvent(userId))) as
			| IUserInfo
			| undefined;

		return user;
	}

	public async getIntegrationUserByEmail(email: string): Promise<IUserInfo | undefined> {
		const user = (await this.integrationCall(GetUserByEmailIntegrationEvent.eventName, new GetUserByEmailIntegrationEvent(email))) as
			| IUserInfo
			| undefined;

		return user;
	}

	async createIntegrationUser(dto: SignUpIntegrationDto): Promise<IUserCreated> {
		const user = (await this.integrationCall(
			CreateUserIntegrationEvent.eventName,
			new CreateUserIntegrationEvent({
				email: dto.email,
			}),
		)) as IUserCreated;

		if (!user?.id) {
			throw CannotCreateUserError.failed();
		}

		return {
			id: user.id,
		};
	}

	private async integrationCall(eventType: string, event: IntegrationEvent) {
		const eventData = await this.eventEmitter.emitAsync(eventType, event);

		this.handleIntergationError(eventData[0]);

		return eventData[0];
	}

	private handleIntergationError(data: unknown) {
		if (data instanceof BaseError) {
			throw data;
		}
	}
}
