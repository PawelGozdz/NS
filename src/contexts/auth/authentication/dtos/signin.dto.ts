import { GlobalDto } from '@libs/common';
import { PickType } from '@nestjs/swagger';

export class SignInDto extends PickType(GlobalDto, ['email', 'password']) {}
