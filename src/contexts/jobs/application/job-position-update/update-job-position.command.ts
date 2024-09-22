import { IActorBase } from '@libs/common';
import { Command } from '@libs/cqrs';

export class UpdateJobPositionCommand extends Command<UpdateJobPositionCommand, UpdateJobPositionResponseDto> {
  id: string;

  title?: string;

  categoryId?: number;

  skillIds?: number[];

  actor: IActorBase;

  constructor(command: UpdateJobPositionCommand) {
    super(command);

    Object.assign(this, command);
  }
}

export type UpdateJobPositionResponseDto = {
  id: string;
};
