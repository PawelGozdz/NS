import { ICategoriesQueryParams } from '@app/core';
import { IActor } from '@libs/common';
import { Query } from '@libs/cqrs';

export class GetManyCategoriesQuery extends Query<GetManyCategoriesQuery, GetManyCategoriesResponseDto> implements ICategoriesQueryParams {
  _filter?: { id?: number; name?: string; parentId?: number } | undefined;

  actor: IActor;

  constructor(query: GetManyCategoriesQuery) {
    super(query);

    Object.assign(this, query);
  }
}

export type GetManyCategoriesResponseDto = Array<{
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
}>;
