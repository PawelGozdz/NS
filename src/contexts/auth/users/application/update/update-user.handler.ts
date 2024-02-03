import { EntityId } from '@libs/common';
import { CommandHandler, IInferredCommandHandler } from '@libs/cqrs';
import { PinoLogger } from 'nestjs-pino';

import { IUsersCommandRepository, UserNotFoundError } from '../../domain';
import { UpdateUserCommand } from './update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements IInferredCommandHandler<UpdateUserCommand> {
	constructor(
		private readonly userCommandRepository: IUsersCommandRepository,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(this.constructor.name);
	}

	async execute(command: UpdateUserCommand): Promise<void> {
		this.logger.info(command, 'Updating user:');

		const userId = EntityId.create(command.id);

		const user = await this.userCommandRepository.getOneById(userId);

		if (!user) {
			throw UserNotFoundError.withEntityId(userId);
		}

		user.update(command);

		await this.userCommandRepository.save(user);
	}
}
