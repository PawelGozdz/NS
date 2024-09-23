import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { IJobPositionQueryParams } from '../interfaces';
import { JobPositionGlobalDto } from './job-position-global.dto';

class Filter extends PickType(JobPositionGlobalDto, ['id', 'categoryId', 'title', 'skillIds']) {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  id: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  title: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  categoryId: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  skillIds: number[];
}

export class JobPositionsQueryParamsDto implements IJobPositionQueryParams {
  @ApiProperty({
    required: false,
    type: Filter,
    example: '[name]=title&[categoryId]=1',
  })
  @IsOptional()
  @Type(() => Filter)
  @ValidateNested()
  _filter?: Filter;
}
