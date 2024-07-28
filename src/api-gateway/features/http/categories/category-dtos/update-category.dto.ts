import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CategoryGlobalDto } from '@app/core';

export class UpdateCategoryDto extends PickType(CategoryGlobalDto, ['name', 'description', 'parentId']) {
  @ApiProperty({
    nullable: false,
    required: false,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  description: string | null;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  @IsOptional()
  parentId: number | null;
}

export class UpdateCategoryParamDto extends PickType(CategoryGlobalDto, ['id']) {}
