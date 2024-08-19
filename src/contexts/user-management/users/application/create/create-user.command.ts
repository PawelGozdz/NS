import { IActor } from '@libs/common';
import { Command } from '@libs/cqrs';

export class CreateUserCommand extends Command<CreateUserCommand, CreateUserResponse> {
  email: string;

  actor: IActor;

  constructor(command: CreateUserCommand) {
    super(command);

    Object.assign(this, command);
  }
}

export type CreateUserResponse = {
  id: string;
};
