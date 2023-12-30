import { CommandHandler, IInferredCommandHandler } from '@libs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { IUsersCommandRepository, User } from '../../domain';
import { UserAlreadyExistsError } from '../../domain/users/errors/user-already-exists.error';
import { CreateUserCommand, CreateUserResponse } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements IInferredCommandHandler<CreateUserCommand> {
	constructor(
		private readonly userCommandRepository: IUsersCommandRepository,
		private readonly logger: PinoLogger,
	) {
		this.logger.setContext(this.constructor.name);
	}

	async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
		this.logger.info(command, 'Creating user:');

		const currentUser = await this.userCommandRepository.getOneByEmail(command.email);

		if (currentUser) {
			throw UserAlreadyExistsError.withEmail(command.email);
		}

		const user = this.createUserInstance(command);

		await this.userCommandRepository.save(user);

		return { id: user.getId() };
	}

	private createUserInstance(command: CreateUserCommand) {
		return User.create({
			email: command.email,
		});
	}
}
