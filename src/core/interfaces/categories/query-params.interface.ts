import { IQueryParams } from '../query-params.interface';

export interface ICategoriesQueryParams extends IQueryParams {
  _filter?: {
    id?: number;
    ctx?: string;
    name?: string;
    parentId?: number;
  };
}
