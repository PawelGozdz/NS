import { PinoLogger } from 'nestjs-pino';

import { Actor } from '@app/core';
import { EntityId } from '@libs/common';
import { IInferredQueryHandler, QueryHandler } from '@libs/cqrs';

import { IJobUserProfileQueryRepository, JobUserProfileNotFoundError } from '../../domain';
import { GetJobUserProfileByUserIdQuery, GetJobUserProfileByUserIdQueryResult } from './get-job-user-profile-by-user-id.query';

@QueryHandler(GetJobUserProfileByUserIdQuery)
export class GetJobUserProfileByUserIdIdHandler implements IInferredQueryHandler<GetJobUserProfileByUserIdQuery> {
  public constructor(
    private readonly logger: PinoLogger,
    private readonly userQueryRepository: IJobUserProfileQueryRepository,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async execute(query: GetJobUserProfileByUserIdQuery): Promise<GetJobUserProfileByUserIdQueryResult> {
    this.logger.info(query, 'Getting user by user id');

    Actor.create(query.actor.type, query.actor.source, query.actor.id);

    const id = new EntityId(query.userId);
    const userJobProfileInfo = await this.userQueryRepository.getOneByUserId(id);

    if (!userJobProfileInfo) {
      throw JobUserProfileNotFoundError.withEntityId(id);
    }

    return {
      id: userJobProfileInfo.id,
      userId: userJobProfileInfo.userId,
      bio: userJobProfileInfo.bio,
      salaryRange: {
        from: userJobProfileInfo.salaryRange.from,
        to: userJobProfileInfo.salaryRange.to,
      },
      jobIds: userJobProfileInfo.jobIds,
      jobPositionIds: userJobProfileInfo.jobPositionIds,
      experience: userJobProfileInfo.experience,
      education: userJobProfileInfo.education,
      certificates: userJobProfileInfo.certificates,
    };
  }
}
