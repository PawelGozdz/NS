export interface GetOptions {
  shuffle?: boolean;
  limit?: number;
  stretch?: boolean;
  stretchRandom?: boolean;
  fields?: string[] | number[];
  sort?: {
    sortColumn: string;
    sortDirection?: 'asc' | 'desc';
  };
}

export interface InsertOptions {
  quantity?: number;
}
