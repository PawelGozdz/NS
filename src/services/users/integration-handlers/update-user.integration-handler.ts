import { UpdateUserIntegrationEvent } from '@libs/common';
import { CommandBus } from '@libs/cqrs';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UpdateUserCommand } from '../application/update/update-user.command';

@Injectable()
export class OnUpdateUserEventHandler {
	constructor(private readonly commandBus: CommandBus) {}

	@OnEvent(UpdateUserIntegrationEvent.eventName)
	async onUserCreated({ payload: { id, email } }: UpdateUserIntegrationEvent): Promise<void> {
		try {
			return await this.commandBus.execute(
				new UpdateUserCommand({
					id,
					email,
				}),
			);
		} catch (error) {
			return error;
		}
	}
}
