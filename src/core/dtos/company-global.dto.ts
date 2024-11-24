import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDefined, IsNotIn, Length } from 'class-validator';

import { systemVariables } from '@libs/common';

import { RelatedTo } from '../decorators';
import { CountryCode } from '../enums';
import { GlobalDto } from './global.dto';

export class CompanyGlobalDto extends PickType(GlobalDto, ['id', 'address', 'email', 'phoneNumber', 'countryCode']) {
  @ApiProperty({
    required: true,
    example: systemVariables.dtos.companies.name.example1,
    minimum: systemVariables.dtos.companies.name.MIN_LENGTH,
    maximum: systemVariables.dtos.companies.name.MAX_LENGTH,
  })
  @IsDefined()
  @IsNotIn([null])
  @Length(systemVariables.dtos.companies.name.MIN_LENGTH, systemVariables.dtos.companies.name.MAX_LENGTH)
  name: string;

  @RelatedTo<CompanyGlobalDto>('countryCode')
  phoneNumber: string;

  @RelatedTo<CompanyGlobalDto>('phoneNumber')
  countryCode: CountryCode;
}
