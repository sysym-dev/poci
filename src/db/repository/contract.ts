export interface ReadOptions {
  page?: {
    size?: number;
    number?: number;
  };
  filter?: Record<string, any>;
}
export interface ReadRowsOptions {
  page: {
    limit: number;
    offset: number;
  };
  filter: Record<string, any>;
}
export interface ReadMetaOptions {
  page: {
    size: number;
    number: number;
  };
  filter: Record<string, any>;
}
export interface CountOptions {
  filter: Record<string, any>;
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
