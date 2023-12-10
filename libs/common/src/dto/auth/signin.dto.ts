import { PickType } from '@nestjs/swagger';
import { GlobalDto } from '../global.dto';

export class SignInDto extends PickType(GlobalDto, ['email', 'password']) {}
