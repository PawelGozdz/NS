import { PickType } from '@nestjs/swagger';

import { CompanyGlobalDto } from '@app/core';

import { CompanyResponseDto } from './company-response.dto';

export class GetCompanyByIdDto extends PickType(CompanyGlobalDto, ['id']) {}

export class GetCompanyByIdResponseDto extends CompanyResponseDto {}
