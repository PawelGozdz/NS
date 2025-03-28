import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsOptional, ValidateIf, ValidateNested } from 'class-validator';

import { GlobalDto } from '@app/core';

import { ProfileDto } from './profile.dto';

class PartialUpdateProfileDto extends PartialType(ProfileDto) {}

export class UpdateUserDto extends PickType(GlobalDto, ['email']) {
  @ApiProperty({
    required: false,
    nullable: false,
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    type: PartialUpdateProfileDto,
  })
  @ValidateIf(({ value }) => value !== null)
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PartialUpdateProfileDto)
  profile?: PartialUpdateProfileDto;
}

export class UpdateUserValidationErrorDto {
  @ApiProperty({
    description: 'A list of validation errors',
    example: ['email must be an email'],
    nullable: false,
  })
  subErrors: string[];

  @ApiProperty({
    description: 'Input validation error',
    example: 'Bad Request Exception',
    nullable: false,
  })
  error: string;
}
