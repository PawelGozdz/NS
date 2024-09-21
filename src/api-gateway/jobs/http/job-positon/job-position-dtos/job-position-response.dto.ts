import { PickType } from '@nestjs/swagger';

import { JobPositionGlobalDto } from '@app/core';

export class JobPositionResponseDto extends PickType(JobPositionGlobalDto, ['id', 'title', 'slug', 'categoryId', 'skillIds']) {}
