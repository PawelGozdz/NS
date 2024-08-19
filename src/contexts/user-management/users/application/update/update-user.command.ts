import { IUpdateProfile } from '@app/core';
import { IActor } from '@libs/common';
import { Command } from '@libs/cqrs';

export class UpdateUserCommand extends Command<UpdateUserCommand, void> {
  id: string;

  email?: string;

  profile?: IUpdateProfile;

  actor: IActor;

  constructor(command: UpdateUserCommand) {
    super(command);

    Object.assign(this, command);
  }
}
