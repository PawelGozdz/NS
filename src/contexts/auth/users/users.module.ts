import { DatabaseModule } from '@app/database/kysley';
import { CqrsModule } from '@libs/cqrs';
import { Module } from '@nestjs/common';

import { CreateUserHandler, GetUserByEmailHandler, GetUserByIdHandler, UpdateUserHandler } from './application';
import { IUsersCommandRepository, IUsersQueryRepository } from './domain';
import { UsersCommandRepository, UsersQueryRepository } from './infrastructure';
import { OnUGetUserByEmailEventHandler } from './integration-handlers';
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
const queries = [];
const commands = [CreateUserHandler, UpdateUserHandler, GetUserByEmailHandler, GetUserByIdHandler];
const integrationHandlers = [OnUGetUserByIdEventHandler, OnUGetUserByEmailEventHandler, OnCreateUserEventHandler, OnCreateUserEventHandler];

@Module({
	imports: [CqrsModule, DatabaseModule],
	providers: [...providers, ...queries, ...commands, ...integrationHandlers],
})
export class UsersModule {}
