import { Command } from '@libs/cqrs';

export class CreateUserCommand extends Command<CreateUserCommand, CreateUserResponse> {
  email: string;

  constructor(command: CreateUserCommand) {
    super(command);

    Object.assign(this, command);
  }
}

export type CreateUserResponse = {
  id: string;
};
