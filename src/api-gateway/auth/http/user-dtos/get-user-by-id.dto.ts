import { GlobalDto } from '@libs/common';
import { PickType } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class GetUserByIdDto extends PickType(GlobalDto, ['id']) {}

export class GetUserByIdResponseDto extends UserResponseDto {}
