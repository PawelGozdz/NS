import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { ISkillsQueryParams } from '../interfaces';
import { SkillGlobalDto } from './skill-global.dto';

class Filter extends PickType(SkillGlobalDto, ['id', 'name']) {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  id: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  name: string;
}

export class SkillsQueryParamsDto implements ISkillsQueryParams {
  @ApiProperty({
    required: false,
    type: Filter,
    example: '[name]=title&[context]=users&[parentId]=1&[id]=1',
  })
  @IsOptional()
  @Type(() => Filter)
  @ValidateNested()
  _filter?: Filter;
}
