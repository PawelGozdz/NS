import { PickType } from '@nestjs/swagger';

import { JobPositionGlobalDto } from '@app/core';

export class CreateJobPositionDto extends PickType(JobPositionGlobalDto, ['categoryId', 'title', 'skillIds']) {}
