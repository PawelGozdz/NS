import { UserUpdatedEvent } from '@app/contexts/auth/users';
import { EventsHandler, IEventHandler } from '@libs/cqrs';
import { PinoLogger } from 'nestjs-pino';

import { IAuthUsersRepository } from '../../repositories';

@EventsHandler(UserUpdatedEvent)
export class OnUserDeletedHandler implements IEventHandler<UserUpdatedEvent> {
	constructor(
		private readonly authRepository: IAuthUsersRepository,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(OnUserDeletedHandler.name);
	}

	async handle(event: UserUpdatedEvent): Promise<void> {
		this.logger.info(event, 'Updating user from users');

		const user = await this.authRepository.getByUserId(event.profile.userId.value);

		if (!user) {
			this.logger.warn(`User with ID ${event.id.value} doesn't exists!`);
			return;
		}

		user.email = event.email;

		await this.authRepository.update(user);
	}
}
