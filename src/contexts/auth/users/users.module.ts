import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/core';
import { CqrsModule } from '@libs/cqrs';

import { CreateUserHandler, GetUserByEmailHandler, GetUserByIdHandler, GetUsersHandler, UpdateUserHandler } from './application';
import { IUsersCommandRepository, IUsersQueryRepository } from './domain';
import { UsersCommandRepository, UsersQueryRepository } from './infrastructure';
import {
  OnCreateUserEventHandler,
  OnUGetUserByEmailEventHandler,
  OnUGetUserByIdEventHandler,
  OnUpdateUserEventHandler,
} from './integration-handlers';

const providers = [
  {
    provide: IUsersCommandRepository,
    useClass: UsersCommandRepository,
  },
  {
    provide: IUsersQueryRepository,
    useClass: UsersQueryRepository,
  },
];
const queries = [GetUsersHandler, GetUserByEmailHandler, GetUserByIdHandler];
const commands = [CreateUserHandler, UpdateUserHandler];
const integrationHandlers = [OnUGetUserByIdEventHandler, OnUGetUserByEmailEventHandler, OnCreateUserEventHandler, OnUpdateUserEventHandler];

@Module({
  imports: [CqrsModule, DatabaseModule],
  providers: [...providers, ...queries, ...commands, ...integrationHandlers],
})
export class UsersModule {}
