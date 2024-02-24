import { GlobalDto } from '@libs/common';
import { PickType } from '@nestjs/swagger';

export class SignUpIntegrationDto extends PickType(GlobalDto, ['email']) {}
