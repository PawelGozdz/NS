import { IJobPositionQueryParams } from '@app/core';
import { IActorBase } from '@libs/common';
import { Query } from '@libs/cqrs';

export class GetManyJobPositionsQuery extends Query<GetManyJobPositionsQuery, GetManyJobPositionsResponseDto> implements IJobPositionQueryParams {
  _filter?: { id?: string; title?: string; categoryId?: number; skillIds?: number[] } | undefined;

  actor: IActorBase;

  constructor(query: GetManyJobPositionsQuery) {
    super(query);

    Object.assign(this, query);
  }
}

export type GetManyJobPositionsResponseDto = Array<{
  id: string;
  title: string;
  slug: string;
  categoryId: number;
  skillIds: number[];
}>;
