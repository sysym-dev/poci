import { EntityAttributes } from '../entity';

export type SortValues<T = {}> =
  | Record<keyof T, 'asc' | 'desc'>
  | Record<string, 'asc' | 'desc'>;

export interface ReadOptions<T = {}> {
  page?: {
    size?: number;
    number?: number;
  };
  filter?: Partial<T> | Record<string, any>;
  sort?: SortValues<T>;
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
  sort: SortValues<T>;
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
export interface ExistsOptions<T = {}> {
  filter: Partial<T> | Record<string, any>;
}
export interface StoreOptions<T = {}> {
  values: Partial<EntityAttributes<T>>;
  filter?: Partial<T> | Record<string, any>;
  failOrNull?: boolean;
}
export interface UpdateOptions<T = {}> {
  values: Partial<EntityAttributes<T>>;
  filter: Partial<T> | Record<string, any>;
  failOrNull?: boolean;
}
export interface CreateOptions<T = {}> {
  values: Partial<EntityAttributes<T>>;
}
export interface DeleteOptions<T = {}> {
  filter?: Partial<T> | Record<string, any>;
  failOrNull?: boolean;
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
