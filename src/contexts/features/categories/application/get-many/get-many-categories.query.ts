import { ICategoriesQueryParams } from '@app/core';
import { Query } from '@libs/cqrs';

export class GetManyCategoriesQuery extends Query<GetManyCategoriesQuery, GetManyCategoriesResponseDto> implements ICategoriesQueryParams {
  _filter?: { id?: number; ctx?: string; name?: string; parentId?: number } | undefined;

  constructor(query: GetManyCategoriesQuery) {
    super(query);

    Object.assign(this, query);
  }
}

export type GetManyCategoriesResponseDto = Array<{
  id: number;
  name: string;
  ctx: string;
  description: string | null;
  parentId: number | null;
}>;
