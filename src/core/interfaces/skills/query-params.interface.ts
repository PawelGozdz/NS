import { IQueryParams } from '../query-params.interface';

export interface ISkillsQueryParams extends IQueryParams {
  _filter?: {
    id?: number;
    name?: string;
    ids?: number[];
  };
}
