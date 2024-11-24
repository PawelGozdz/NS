import { PickType } from '@nestjs/swagger';

import { CompanyGlobalDto } from '@app/core';

export class CompanyResponseDto extends PickType(CompanyGlobalDto, ['id', 'name', 'address', 'phoneNumber', 'email']) {}
