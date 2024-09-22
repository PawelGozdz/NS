import { Module } from '@nestjs/common';

import { DatabaseModule, OutboxModule } from '@app/core';
import { CqrsModule } from '@libs/cqrs';

import {
  CreateJobPositionHandler,
  CreateJobUserProfileHandler,
  CreateSkillHandler,
  GetJobUserProfileByIdHandler,
  GetJobUserProfileByUserIdIdHandler,
  GetManyJobPositionsHandler,
  GetManySkillsHandler,
  UpdateJobPositionHandler,
  UpdateJobUserProfileHandler,
} from './application';
import {
  IJobCommandRepository,
  IJobPositionCommandRepository,
  IJobPositionQueryRepository,
  IJobQueryRepository,
  IJobUserProfileCommandRepository,
  IJobUserProfileQueryRepository,
  ISkillsCommandRepository,
  ISkillsQueryRepository,
} from './domain';
import {
  JobCommandRepository,
  JobPositionCommandRepository,
  JobPositionQueryRepository,
  JobQueryRepository,
  JobUserProfileCommandRepository,
  JobUserProfileQueryRepository,
  SkillsCommandRepository,
  SkillsQueryRepository,
} from './infrastructure';

const providers = [
  {
    provide: ISkillsCommandRepository,
    useClass: SkillsCommandRepository,
  },
  {
    provide: ISkillsQueryRepository,
    useClass: SkillsQueryRepository,
  },
  {
    provide: IJobUserProfileCommandRepository,
    useClass: JobUserProfileCommandRepository,
  },
  {
    provide: IJobUserProfileQueryRepository,
    useClass: JobUserProfileQueryRepository,
  },
  {
    provide: IJobCommandRepository,
    useClass: JobCommandRepository,
  },
  {
    provide: IJobQueryRepository,
    useClass: JobQueryRepository,
  },
  {
    provide: IJobPositionCommandRepository,
    useClass: JobPositionCommandRepository,
  },
  {
    provide: IJobPositionQueryRepository,
    useClass: JobPositionQueryRepository,
  },
];

const queries = [GetManySkillsHandler, GetJobUserProfileByIdHandler, GetJobUserProfileByUserIdIdHandler, GetManyJobPositionsHandler];
const commands = [CreateSkillHandler, CreateJobUserProfileHandler, UpdateJobUserProfileHandler, CreateJobPositionHandler, UpdateJobPositionHandler];

@Module({
  imports: [CqrsModule, DatabaseModule, OutboxModule],
  providers: [...providers, ...queries, ...commands],
  exports: [...providers, ...queries, ...commands],
})
export class JobsModule {}
