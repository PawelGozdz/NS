import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { SkillGlobalDto } from '@app/core';

export class CreateSkillDto extends PickType(SkillGlobalDto, ['name', 'description', 'categoryId']) {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  parentId: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  description: string;
}
