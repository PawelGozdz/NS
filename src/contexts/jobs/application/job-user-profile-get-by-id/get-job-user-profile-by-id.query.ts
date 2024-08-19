import { IActor } from '@libs/common';
import { Query } from '@libs/cqrs';

import { JobUserProfileInfo } from '../../domain';

export class GetJobUserProfileByIdQuery extends Query<GetJobUserProfileByIdQuery, GetJobUserProfileByIdQueryResult> {
  id: string;

  actor: IActor;

  constructor(command: GetJobUserProfileByIdQuery) {
    super(command);

    Object.assign(this, command);
  }
}

export type GetJobUserProfileByIdQueryResult = JobUserProfileInfo;
