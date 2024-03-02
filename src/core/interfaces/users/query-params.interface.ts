import { IQueryParams } from '../query-params.interface';

export interface IUsersQueryParams extends IQueryParams {
  _filter?: {
    email?: string;
    id?: string;
  };
}
