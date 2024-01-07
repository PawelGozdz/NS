import { DomainErrorType, EntityId } from '@libs/common';
import { IInferredQueryHandler, QueryHandler } from '@libs/cqrs';
import { PinoLogger } from 'nestjs-pino';

import { IUsersQueryRepository, UserNotFoundError } from '../../domain';
import { GetUserByIdQuery, GetUserByIdQueryResult } from './get-user-by-id.query';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IInferredQueryHandler<GetUserByIdQuery> {
	public constructor(
		private readonly logger: PinoLogger,
		private readonly userQueryRepository: IUsersQueryRepository,
	) {
		this.logger.setContext(this.constructor.name);
	}

	public async execute(query: GetUserByIdQuery): Promise<GetUserByIdQueryResult> {
		this.logger.info(query, 'Getting user by id');

		const userId = new EntityId(query.userId);
		const userInfo = await this.userQueryRepository.getOneById(userId);

		if (!userInfo) {
			throw UserNotFoundError.withEntityId(userId, {
				domain: DomainErrorType.IDENTITY,
			});
		}

		return {
			id: userInfo.id,
			email: userInfo.email,
		};
	}
}
