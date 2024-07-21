import { PickType } from '@nestjs/swagger';

import { CategoryGlobalDto } from '@app/core';

export class CategoryResponseDto extends PickType(CategoryGlobalDto, ['id', 'name', 'description', 'context', 'parentId']) {}
