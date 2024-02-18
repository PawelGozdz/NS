import { GlobalDto } from '@libs/common';
import { PickType } from '@nestjs/swagger';

import { CategoryResponseDto } from './category-response.dto';

export class GetCategoryByIdDto extends PickType(GlobalDto, ['id']) {}

export class GetCategoryByIdResponseDto extends CategoryResponseDto {}
