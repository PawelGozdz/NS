import { Module } from '@nestjs/common';

import { DatabaseModule, OutboxModule } from '@app/core';
import { CqrsModule } from '@libs/cqrs';

import { CreateSkillHandler, GetManySkillsHandler } from './application';
import { ISkillsCommandRepository, ISkillsQueryRepository } from './domain';
import { SkillsCommandRepository, SkillsQueryRepository } from './infrastructure';

const providers = [
  {
    provide: ISkillsCommandRepository,
    useClass: SkillsCommandRepository,
  },
  {
    provide: ISkillsQueryRepository,
    useClass: SkillsQueryRepository,
  },
];
const queries = [GetManySkillsHandler];
const commands = [CreateSkillHandler];

@Module({
  imports: [CqrsModule, DatabaseModule, OutboxModule],
  providers: [...providers, ...queries, ...commands],
  exports: [...providers, ...queries, ...commands],
})
export class SkillsModule {}
