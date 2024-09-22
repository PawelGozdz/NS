import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { JobPositionGlobalDto } from '@app/core';

export class UpdateJobPositionDto extends PickType(JobPositionGlobalDto, ['categoryId', 'title', 'skillIds']) {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  categoryId: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  title: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  skillIds: number[];
}
