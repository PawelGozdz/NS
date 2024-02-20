import { CategoryGlobalDto } from '@app/core';
import { PickType } from '@nestjs/swagger';

export class CategoryResponseDto extends PickType(CategoryGlobalDto, ['id', 'name', 'description', 'ctx', 'parentId']) {}
