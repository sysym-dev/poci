import { EntityAttributes } from '../entity';

export interface ReadOptions<T = {}> {
  page?: {
    size?: number;
    number?: number;
  };
  filter?: Partial<T> | Record<string, any>;
  sort?: Record<keyof T, 'asc' | 'desc'> | Record<string, 'asc' | 'desc'>;
  first?: boolean;
  failOnNull?: boolean;
}
export interface ReadRowOptions<T = {}> {
  filter: Partial<T> | Record<string, any>;
  failOrNull?: boolean;
}
export interface ReadRowsOptions<T = {}> {
  page: {
    limit: number;
    offset: number;
  };
  filter: Partial<T> | Record<string, any>;
  sort: Record<keyof T, 'asc' | 'desc'> | Record<string, 'asc' | 'desc'>;
}
export interface ReadMetaOptions<T = {}> {
  page: {
    size: number;
    number: number;
  };
  filter: Partial<T> | Record<string, any>;
}
export interface CountOptions<T = {}> {
  filter: Partial<T> | Record<string, any>;
}
export interface StoreOptions<T = {}> {
  values: Partial<EntityAttributes<T>>;
}

export interface ReadMetaResult {
  page: {
    size: number;
    number: number;
  };
  total: number;
}
export type ReadResult<T> =
  | {
      rows: T[];
      meta: ReadMetaResult;
    }
  | T;
