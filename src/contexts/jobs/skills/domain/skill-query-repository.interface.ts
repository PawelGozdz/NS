import { ISkillsQueryParams } from '@app/core';

export type SkillInfo = {
  id: number;
  name: string;
  context: string;
  parentId: number | null;
  description: string | null;
  categoryId: number;
};

export abstract class ISkillsQueryRepository {
  abstract getManyBy(query: ISkillsQueryParams): Promise<SkillInfo[]>;
}
