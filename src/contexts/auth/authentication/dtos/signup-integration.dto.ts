import { PickType } from '@nestjs/swagger';

import { GlobalDto } from '@libs/common';

export class SignUpIntegrationDto extends PickType(GlobalDto, ['email']) {}
