import { PickType } from '@nestjs/swagger';

import { GlobalDto } from '@libs/common';

export class SignInDto extends PickType(GlobalDto, ['email', 'password']) {}
