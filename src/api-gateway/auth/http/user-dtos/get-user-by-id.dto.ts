import { PickType } from '@nestjs/swagger';

import { GlobalDto } from '@libs/common';

import { UserResponseDto } from './user-response.dto';

export class GetUserByIdDto extends PickType(GlobalDto, ['id']) {}

export class GetUserByIdResponseDto extends UserResponseDto {}
