import { PickType } from '@nestjs/swagger';

import { GlobalDto } from '@app/core';

export class SignInDto extends PickType(GlobalDto, ['email', 'password']) {}
