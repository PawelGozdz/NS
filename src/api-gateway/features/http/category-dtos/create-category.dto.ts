import { GlobalDto } from '@libs/common';
import { PickType } from '@nestjs/swagger';

export class CreateCategoryDto extends PickType(GlobalDto, ['name', 'description', 'parentId', 'context']) {}
