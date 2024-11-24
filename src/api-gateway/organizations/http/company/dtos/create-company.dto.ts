import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { Address, CompanyGlobalDto, CountryCode } from '@app/core';

import { CompanyResponseDto } from './company-response.dto';

export class CreateCompanyDto extends PickType(CompanyGlobalDto, ['name', 'address', 'phoneNumber', 'email', 'countryCode']) {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  address: Address;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  countryCode: CountryCode;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  email: string;
}

export class CreateCompanyResponseDto extends PickType(CompanyResponseDto, ['id']) {}
