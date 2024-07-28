import { ISkillsQueryParams } from '@app/core';
import { Query } from '@libs/cqrs';

export class GetManySkillsQuery extends Query<GetManySkillsQuery, GetManySkillsResponseDto> implements ISkillsQueryParams {
  _filter?: { id?: number; name?: string } | undefined;

  constructor(query: GetManySkillsQuery) {
    super(query);

    Object.assign(this, query);
  }
}

export type GetManySkillsResponseDto = Array<{
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
}>;
