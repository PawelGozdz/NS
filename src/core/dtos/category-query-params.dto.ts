import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { ICategoriesQueryParams } from '../interfaces';
import { CategoryGlobalDto } from './category-global.dto';

class Filter extends PickType(CategoryGlobalDto, ['id', 'name', 'context', 'parentId']) {
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

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  context: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  parentId: number;
}

export class CategoriesQueryParamsDto implements ICategoriesQueryParams {
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
