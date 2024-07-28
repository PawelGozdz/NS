import { IActor } from '@libs/common';
import { Query } from '@libs/cqrs';

import { UserInfo } from '../../domain';

export class GetUserByIdQuery extends Query<GetUserByIdQuery, GetUserByIdQueryResult> {
  userId: string;

  actor: IActor;

  constructor(command: GetUserByIdQuery) {
    super(command);

    Object.assign(this, command);
  }
}

export type GetUserByIdQueryResult = UserInfo;
