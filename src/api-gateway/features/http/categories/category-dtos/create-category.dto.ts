import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CategoryGlobalDto } from '@app/core';

export class CreateCategoryDto extends PickType(CategoryGlobalDto, ['name', 'description', 'parentId']) {
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
