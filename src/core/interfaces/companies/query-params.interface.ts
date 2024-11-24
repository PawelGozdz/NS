import { IQueryParams } from '../query-params.interface';

export interface ICompanyQueryParams extends IQueryParams {
  _filter?: {
    id?: string;
    name?: string;
  };
}
