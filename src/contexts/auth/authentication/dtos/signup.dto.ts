import { GlobalDto } from '@libs/common';
import { PickType } from '@nestjs/swagger';

export class SignUpDto extends PickType(GlobalDto, ['email', 'password']) {}
