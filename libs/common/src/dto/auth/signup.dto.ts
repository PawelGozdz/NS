import { PickType } from '@nestjs/swagger';
import { GlobalDto } from '../global.dto';

export class SignUpDto extends PickType(GlobalDto, ['email', 'password', 'roleId']) {}
