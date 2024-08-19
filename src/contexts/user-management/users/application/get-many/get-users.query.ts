import { IUsersQueryParams } from '@app/core';
import { IActor } from '@libs/common';
import { Query } from '@libs/cqrs';

import { UserInfo } from '../../domain';

export class GetUsersQuery extends Query<GetUsersQuery, GetUsersQueryResult> {
  queryParams?: IUsersQueryParams;

  actor: IActor;

  constructor(query: GetUsersQuery) {
    super(query);

    Object.assign(this, query);
  }
}

export type GetUsersQueryResult = UserInfo[];
