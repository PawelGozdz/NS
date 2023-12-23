import {
	CannotCreateUserError,
	CreateUserIntegrationEvent,
	GetUserByEmailIntegrationEvent,
	GetUserByIdIntegrationEvent,
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
	id?: string;
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
		});
	}

	async update(userData: Partial<AuthUser> & { id: string }): Promise<void> {
		return await this.authUsersRepository.update({
			hash: userData.hash,
			hashedRt: userData.hashedRt,
			userId: userData.userId,
		});
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
		const user = await this.eventEmitter.emitAsync(GetUserByIdIntegrationEvent.eventName, new GetUserByIdIntegrationEvent(userId));

		return user?.[0];
	}

	public async getIntegrationUserByEmail(email: string): Promise<IUserInfo | undefined> {
		const user = await this.eventEmitter.emitAsync(GetUserByEmailIntegrationEvent.eventName, new GetUserByEmailIntegrationEvent(email));

		return user?.[0];
	}

	async createIntegrationUser(dto: SignUpIntegrationDto): Promise<IUserCreated> {
		const user = (await this.eventEmitter.emitAsync(
			CreateUserIntegrationEvent.eventName,
			new CreateUserIntegrationEvent({
				email: dto.email,
			}),
		)) as IUserCreated[];

		if (!user[0]?.id) {
			throw CannotCreateUserError.failed();
		}

		return {
			id: user[0].id,
		};
	}
}
