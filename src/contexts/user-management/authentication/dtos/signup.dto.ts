import { PickType } from '@nestjs/swagger';

import { GlobalDto } from '@libs/common';

export class SignUpDto extends PickType(GlobalDto, ['email', 'password']) {}
