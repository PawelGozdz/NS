import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { IUsersQueryParams } from '@app/core';
import { GlobalDto } from '@libs/common';

class Filter extends PickType(GlobalDto, ['email', 'id']) {
  @ApiProperty({
    required: false,
    description: 'Filter by email',
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    required: false,
    description: 'Filter by id',
  })
  @IsOptional()
  id: string;
}

export class UserQueryParamsDto implements IUsersQueryParams {
  @ApiProperty({
    required: false,
    type: Filter,
    example: '[email]=test@test.com',
  })
  @IsOptional()
  @Type(() => Filter)
  @ValidateNested()
  _filter?: Filter;
}
