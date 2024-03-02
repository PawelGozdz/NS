import { PinoLogger } from 'nestjs-pino';

import { Address, ConflictError, EntityId } from '@libs/common';
import { CommandHandler, IInferredCommandHandler } from '@libs/cqrs';

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
    const address = command?.profile?.address ? Address.create(command.profile.address) : undefined;

    const user = await this.userCommandRepository.getOneById(userId);

    if (!user) {
      throw UserNotFoundError.withEntityId(userId);
    }

    if (command.email) {
      const userWithEmail = await this.userCommandRepository.getOneByEmail(command.email);

      if (userWithEmail && userWithEmail.id !== user.id) {
        throw new ConflictError();
      }
    }

    user.update({
      email: command.email,
      profile: {
        ...command.profile,
        address,
      },
    });

    await this.userCommandRepository.save(user);
  }
}
