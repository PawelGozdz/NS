import { PickType } from '@nestjs/swagger';

import { SkillGlobalDto } from '@app/core';

export class SkillResponseDto extends PickType(SkillGlobalDto, ['id', 'name', 'description', 'context', 'parentId']) {}
