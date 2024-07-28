import { IActor } from '@libs/common';
import { Command } from '@libs/cqrs';

export class UpdateCategoryCommand extends Command<UpdateCategoryCommand, UpdateCategoryResponseDto> {
  id: number;

  name?: string;

  description?: string | null;

  parentId?: number | null;

  actor: IActor;

  constructor(command: UpdateCategoryCommand) {
    super(command);

    Object.assign(this, command);
  }
}

export class UpdateCategoryResponseDto {}
