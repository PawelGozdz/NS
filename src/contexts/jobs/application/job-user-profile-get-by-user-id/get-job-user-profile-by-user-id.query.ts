import { IActorBase } from '@libs/common';
import { Query } from '@libs/cqrs';

import { JobUserProfileInfo } from '../../domain';

export class GetJobUserProfileByUserIdQuery extends Query<GetJobUserProfileByUserIdQuery, GetJobUserProfileByUserIdQueryResult> {
  userId: string;

  actor: IActorBase;

  constructor(command: GetJobUserProfileByUserIdQuery) {
    super(command);

    Object.assign(this, command);
  }
}

export type GetJobUserProfileByUserIdQueryResult = JobUserProfileInfo;
