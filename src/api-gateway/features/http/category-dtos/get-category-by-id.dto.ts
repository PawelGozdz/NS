import { PickType } from '@nestjs/swagger';

import { CategoryGlobalDto } from '@app/core';

import { CategoryResponseDto } from './category-response.dto';

export class GetCategoryByIdDto extends PickType(CategoryGlobalDto, ['id']) {}

export class GetCategoryByIdResponseDto extends CategoryResponseDto {}
