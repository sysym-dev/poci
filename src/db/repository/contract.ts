export interface ReadOptions {
  page?: {
    size?: number;
    number?: number;
  };
}
export interface ReadRowsOptions {
  page: {
    limit: number;
    offset: number;
  };
}
export interface ReadMetaOptions {
  page: {
    size: number;
    number: number;
  };
}

export interface ReadMetaResult {
  page: {
    size: number;
    number: number;
  };
  total: number;
}
export interface ReadResult<T> {
  rows: T[];
  meta: ReadMetaResult;
}
