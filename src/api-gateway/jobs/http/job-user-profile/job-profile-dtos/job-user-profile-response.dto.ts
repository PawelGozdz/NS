import { PickType } from '@nestjs/swagger';

import { JobUserProfileGlobalDto } from '@app/core';

export class JobUserProfileResponseDto extends PickType(JobUserProfileGlobalDto, [
  'id',
  'certificates',
  'bio',
  'jobIds',
  'jobPositionIds',
  'userId',
]) {}
