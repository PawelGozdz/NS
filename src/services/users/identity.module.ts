import { CqrsModule } from '@libs/cqrs';
import { Module } from '@nestjs/common';

import { ObjectionModule } from '@willsoto/nestjs-objection';
import { CreateUserHandler, GetUserByEmailHandler, GetUserByIdHandler, UpdateUserHandler } from './application';
import { IUsersCommandRepository, IUsersQueryRepository } from './domain';
import { UserModel, UsersCommandRepository, UsersQueryRepository } from './infrastructure';
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
	imports: [ObjectionModule.forFeature([UserModel]), CqrsModule],
	providers: [...providers, ...queries, ...commands, ...integrationHandlers],
})
export class UsersModule {}
