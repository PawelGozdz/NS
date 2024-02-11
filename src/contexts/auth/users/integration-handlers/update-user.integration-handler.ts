import { UpdateUserIntegrationEvent } from '@app/core';
import { CommandBus } from '@libs/cqrs';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UpdateUserCommand } from '../application';

@Injectable()
export class OnUpdateUserEventHandler {
	constructor(private readonly commandBus: CommandBus) {}

	@OnEvent(UpdateUserIntegrationEvent.eventName)
	async onUserUpdated(data: UpdateUserIntegrationEvent): Promise<void> {
		const { id, email, profile } = data.payload;

		try {
			return await this.commandBus.execute(
				new UpdateUserCommand({
					id,
					email,
					profile,
				}),
			);
		} catch (error) {
			return error;
		}
	}
}
