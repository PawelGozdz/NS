import { ISkillsQueryParams } from '@app/core';
import { IActor } from '@libs/common';
import { Query } from '@libs/cqrs';

export class GetManySkillsQuery extends Query<GetManySkillsQuery, GetManySkillsResponseDto> implements ISkillsQueryParams {
  _filter?: { id?: number; name?: string } | undefined;

  actor: IActor;

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
