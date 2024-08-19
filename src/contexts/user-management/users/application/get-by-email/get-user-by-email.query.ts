import { IActor } from '@libs/common';
import { Query } from '@libs/cqrs';

import { UserInfo } from '../../domain';

export class GetUserByEmailQuery extends Query<GetUserByEmailQuery, GetUserByEmailQueryResult> {
  email: string;

  actor: IActor;

  constructor(command: GetUserByEmailQuery) {
    super(command);

    Object.assign(this, command);
  }
}

export type GetUserByEmailQueryResult = UserInfo;
