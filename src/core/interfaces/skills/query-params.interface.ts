import { IQueryParams } from '../query-params.interface';

export interface ISkillsQueryParams extends IQueryParams {
  _filter?: {
    id?: number;
    context?: string;
    name?: string;
    parentId?: number;
  };
}
