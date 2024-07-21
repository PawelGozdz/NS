import { PickType } from '@nestjs/swagger';

import { SkillGlobalDto } from '@app/core';

import { SkillResponseDto } from './skill-response.dto';

export class GetSkillByIdDto extends PickType(SkillGlobalDto, ['id']) {}

export class GetSkillByIdResponseDto extends SkillResponseDto {}
