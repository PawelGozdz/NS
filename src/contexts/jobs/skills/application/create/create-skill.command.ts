import { PickType } from '@nestjs/swagger';

import { SkillGlobalDto } from '@app/core';
import { Command } from '@libs/cqrs';

export class CreateSkillCommand extends Command<CreateSkillCommand, CreateSkillResponseDto> {
  name: string;

  description?: string;

  categoryId: number;

  constructor(command: CreateSkillCommand) {
    super(command);

    Object.assign(this, command);
  }
}

export class CreateSkillResponseDto extends PickType(SkillGlobalDto, ['id']) {}
