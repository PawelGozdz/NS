import { ISkillsQueryParams } from '@app/core';

export type SkillInfo = {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
};

export abstract class ISkillsQueryRepository {
  abstract getManyBy(query: ISkillsQueryParams): Promise<SkillInfo[]>;
}
