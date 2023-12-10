import { GetUserByEmailIntegrationEvent } from '@libs/common';
import { QueryBus } from '@libs/cqrs';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GetUserByEmailQuery } from '../application';
import { UserInfo } from '../domain';

@Injectable()
export class OnUGetUserByEmailEventHandler {
	constructor(private readonly queryBus: QueryBus) {}

	@OnEvent(GetUserByEmailIntegrationEvent.eventName)
	async onUserByEmailRequested(payload: GetUserByEmailIntegrationEvent): Promise<UserInfo | undefined> {
		return await this.queryBus.execute(
			new GetUserByEmailQuery({
				email: payload.payload.email,
			}),
		);
	}
}
