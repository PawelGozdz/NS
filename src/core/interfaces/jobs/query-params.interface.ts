import { IQueryParams } from '../query-params.interface';

export interface IJobUserProfileQueryParams extends IQueryParams {
  _filter?: {
    id?: string;
    userId?: string;
  };
}

export interface IJobPositionQueryParams extends IQueryParams {
  _filter?: {
    id?: string;
    categoryId?: number;
    title?: string;
    skillIds?: number[];
  };
}

export interface IJobQueryParams extends IQueryParams {
  _filter?: {
    id?: string;
  };
}
