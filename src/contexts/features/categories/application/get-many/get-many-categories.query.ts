import { ICategoriesQueryParams } from '@app/core';
import { Query } from '@libs/cqrs';

export class GetManyCategoriesQuery extends Query<GetManyCategoriesQuery, GetManyCategoriesResponseDto> implements ICategoriesQueryParams {
  _filter?: { id?: number; context?: string; name?: string; parentId?: number } | undefined;

  constructor(query: GetManyCategoriesQuery) {
    super(query);

    Object.assign(this, query);
  }
}

export type GetManyCategoriesResponseDto = Array<{
  id: number;
  name: string;
  context: string;
  description: string | null;
  parentId: number | null;
}>;
