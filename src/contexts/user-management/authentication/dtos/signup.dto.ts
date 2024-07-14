import { PickType } from '@nestjs/swagger';

import { GlobalDto } from '@app/core';

export class SignUpDto extends PickType(GlobalDto, ['email', 'password']) {}
