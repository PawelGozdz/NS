import { PickType } from '@nestjs/swagger';

import { GlobalDto } from './global.dto';

export class IdDto extends PickType(GlobalDto, ['id']) {}
