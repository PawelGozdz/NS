import { PickType } from '@nestjs/swagger';
import { GlobalDto } from '../global.dto';

export class SignUpIntegrationDto extends PickType(GlobalDto, ['email']) {}
