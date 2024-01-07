import { DomainErrorType } from '@libs/common';
import { IInferredQueryHandler, QueryHandler } from '@libs/cqrs';
import { PinoLogger } from 'nestjs-pino';

import { IUsersQueryRepository, UserNotFoundError } from '../../domain';
import { GetUserByEmailQuery, GetUserByEmailQueryResult } from './get-user-by-email.query';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IInferredQueryHandler<GetUserByEmailQuery> {
	public constructor(
		private readonly logger: PinoLogger,
		private readonly userQueryRepository: IUsersQueryRepository,
	) {
		this.logger.setContext(this.constructor.name);
	}

	public async execute(query: GetUserByEmailQuery): Promise<GetUserByEmailQueryResult> {
		this.logger.info(query, 'Getting user by email');

		const { email } = query;
		const userInfo = await this.userQueryRepository.getOneByEmail(email);

		if (!userInfo) {
			throw UserNotFoundError.withEntityEmail(email, {
				domain: DomainErrorType.IDENTITY,
			});
		}

		return {
			id: userInfo.id,
			email: userInfo.email,
		};
	}
}
