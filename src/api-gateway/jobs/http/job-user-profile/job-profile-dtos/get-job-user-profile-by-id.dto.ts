import { PickType } from '@nestjs/swagger';

import { JobUserProfileGlobalDto } from '@app/core';

import { JobUserProfileResponseDto } from './job-user-profile-response.dto';

export class GetJobUserProfileByIdDto extends PickType(JobUserProfileGlobalDto, ['id']) {}

export class GetJobUserProfileByIdResponseDto extends JobUserProfileResponseDto {}
