import {
	CannotCreateUserError,
	CreateUserIntegrationEvent,
	EntityId,
	GetUserByEmailIntegrationEvent,
	GetUserByIdIntegrationEvent,
	SignUpDto,
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

	async create(userData: AuthUser) {
		return await this.authUsersRepository.create({
			id: userData.id,
			email: userData.email,
			hash: userData.hash,
			hashedRt: userData.hashedRt,
			userId: userData.userId,
		});
	}

	async update(userData: Partial<AuthUser> & { id: EntityId }) {
		return await this.authUsersRepository.update({
			hash: userData.hash,
			hashedRt: userData.hashedRt,
			userId: userData.userId,
		});
	}

	async delete(id: EntityId) {
		return await this.authUsersRepository.delete(id);
	}

	async getByUserId(id: EntityId) {
		return await this.authUsersRepository.getByUserId(id);
	}

	async getByUserEmail(email: string) {
		return await this.authUsersRepository.getByUserEmail(email);
	}

	public async getIntegrationUserById(userId: string): Promise<IUserInfo | undefined> {
		const user = await this.eventEmitter.emitAsync(GetUserByIdIntegrationEvent.eventName, new GetUserByIdIntegrationEvent(userId));

		return user[0];
	}

	public async getIntegrationUserByEmail(email: string): Promise<IUserInfo | undefined> {
		const user = await this.eventEmitter.emitAsync(GetUserByEmailIntegrationEvent.eventName, new GetUserByEmailIntegrationEvent(email));

		return user[0];
	}

	async createIntegrationUser(dto: SignUpDto): Promise<IUserCreated> {
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
