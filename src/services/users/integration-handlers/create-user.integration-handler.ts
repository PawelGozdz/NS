import { CreateUserIntegrationEvent } from '@libs/common';
import { CommandBus } from '@libs/cqrs';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateUserCommand, CreateUserResponse } from '../application';

@Injectable()
export class OnCreateUserEventHandler {
	constructor(private readonly commandBus: CommandBus) {}

	@OnEvent(CreateUserIntegrationEvent.eventName)
	async onUserCreated(payload: CreateUserIntegrationEvent): Promise<CreateUserResponse> {
		return await this.commandBus.execute(
			new CreateUserCommand({
				hash: payload.payload.hash,
				hashedRt: payload.payload.hashedRt,
				email: payload.payload.email,
				roleId: payload.payload.roleId,
			}),
		);
	}
}
