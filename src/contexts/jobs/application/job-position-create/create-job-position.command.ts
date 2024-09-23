import { IActorBase } from '@libs/common';
import { Command } from '@libs/cqrs';

export class CreateJobPositionCommand extends Command<CreateJobPositionCommand, CreateJobPositionResponseDto> {
  title: string;

  categoryId: number;

  skillIds?: number[];

  actor: IActorBase;

  constructor(command: CreateJobPositionCommand) {
    super(command);

    Object.assign(this, command);
  }
}

export type CreateJobPositionResponseDto = {
  id: string;
};
