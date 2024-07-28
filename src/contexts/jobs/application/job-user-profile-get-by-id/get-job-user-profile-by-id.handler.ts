import { PinoLogger } from 'nestjs-pino';

import { Actor } from '@app/core';
import { EntityId } from '@libs/common';
import { IInferredQueryHandler, QueryHandler } from '@libs/cqrs';

import { IJobUserProfileQueryRepository, JobUserProfileNotFoundError } from '../../domain';
import { GetJobUserProfileByIdQuery, GetJobUserProfileByIdQueryResult } from './get-job-user-profile-by-id.query';

@QueryHandler(GetJobUserProfileByIdQuery)
export class GetJobUserProfileByIdHandler implements IInferredQueryHandler<GetJobUserProfileByIdQuery> {
  public constructor(
    private readonly logger: PinoLogger,
    private readonly userQueryRepository: IJobUserProfileQueryRepository,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  public async execute(query: GetJobUserProfileByIdQuery): Promise<GetJobUserProfileByIdQueryResult> {
    this.logger.info(query, 'Getting job user profile by id');

    Actor.create(query.actor.type, query.actor.source, query.actor.id);

    const id = new EntityId(query.id);
    const userJobProfileInfo = await this.userQueryRepository.getOneById(id);

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
