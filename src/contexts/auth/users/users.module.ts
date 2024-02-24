import { DatabaseModule } from '@app/core';
import { CqrsModule } from '@libs/cqrs';
import { Module } from '@nestjs/common';

import { CreateUserHandler, GetUserByEmailHandler, GetUserByIdHandler, GetUsersHandler, UpdateUserHandler } from './application';
import { IUsersCommandRepository, IUsersQueryRepository } from './domain';
import { UsersCommandRepository, UsersQueryRepository } from './infrastructure';
import { OnUGetUserByEmailEventHandler, OnUpdateUserEventHandler } from './integration-handlers';
import { OnCreateUserEventHandler } from './integration-handlers/create-user.integration-handler';
import { OnUGetUserByIdEventHandler } from './integration-handlers/get-user-by-id.integration-handler';

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
