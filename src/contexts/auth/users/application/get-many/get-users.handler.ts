import { IInferredQueryHandler, QueryHandler } from '@libs/cqrs';
import { PinoLogger } from 'nestjs-pino';

import { IUsersQueryRepository } from '../../domain';
import { GetUsersQuery, GetUsersQueryResult } from './get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IInferredQueryHandler<GetUsersQuery> {
	public constructor(
		private readonly logger: PinoLogger,
		private readonly userQueryRepository: IUsersQueryRepository,
	) {
		this.logger.setContext(this.constructor.name);
	}

	public async execute(query: GetUsersQuery): Promise<GetUsersQueryResult> {
		this.logger.info(query, 'Getting users');

		const usersInfo = await this.userQueryRepository.getMany(query.queryParams);

		return usersInfo.map((user) => ({
			id: user.id,
			email: user.email,
			profile: {
				id: user.profile.id,
				userId: user.profile.userId,
				firstName: user.profile.firstName,
				lastName: user.profile.lastName,
				username: user.profile.username,
				bio: user.profile.bio,
				dateOfBirth: user.profile.dateOfBirth,
				gender: user.profile.gender,
				address: user.profile.address,
				phoneNumber: user.profile.phoneNumber,
				profilePicture: user.profile.profilePicture,
				hobbies: user.profile.hobbies,
				languages: user.profile.languages,
				rodoAcceptanceDate: user.profile.rodoAcceptanceDate,
			},
		}));
	}
}
