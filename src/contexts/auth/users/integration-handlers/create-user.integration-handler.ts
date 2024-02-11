import { CreateUserIntegrationEvent } from '@app/core';
import { CommandBus } from '@libs/cqrs';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CreateUserCommand, CreateUserResponse } from '../application';

@Injectable()
export class OnCreateUserEventHandler {
	constructor(private readonly commandBus: CommandBus) {}

	@OnEvent(CreateUserIntegrationEvent.eventName)
	async onUserCreated(payload: CreateUserIntegrationEvent): Promise<CreateUserResponse> {
		try {
			return await this.commandBus.execute(
				new CreateUserCommand({
					email: payload.payload.email,
				}),
			);
		} catch (error) {
			return error;
		}
	}
}
