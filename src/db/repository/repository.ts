import { Knex } from 'knex';
import { db } from '../db';
import { Entity, EntityAttributes, EntityId } from '../entity';
import { parsePaginate } from '../paginate';
import {
  CountOptions,
  CreateOptions,
  DeleteOptions,
  ExistsOptions,
  ReadMetaOptions,
  ReadMetaResult,
  ReadOptions,
  ReadResult,
  ReadRowOptions,
  ReadRowsOptions,
  StoreOptions,
  UpdateOptions,
} from './contract';
import { QueryError } from '../errors/query.error';

export abstract class Repository<T extends Entity> {
  abstract table: string;

  abstract filter(values: Record<string, any>): Knex.QueryCallback;

  async read(options?: ReadOptions<T>): Promise<ReadResult<T>> {
    if (options?.first) {
      return await this.readRow({
        filter: options?.filter ?? {},
        failOrNull: options?.failOnNull,
      });
    }

    const page = parsePaginate(options?.page?.size, options?.page?.number);

    return {
      meta: await this.readMeta({
        page: {
          size: page.limit,
          number: page.number,
        },
        filter: options?.filter ?? {},
      }),
      rows: await this.readRows({
        page: {
          limit: page.limit,
          offset: page.offset,
        },
        filter: options?.filter ?? {},
        sort: options?.sort ?? {},
      }),
    };
  }

  async readRows(options: ReadRowsOptions<T>): Promise<T[]> {
    const sortValues = Object.entries(options.sort).map(([column, order]) => ({
      column,
      order,
    }));

    return await db(this.table)
      .where(this.filter(options?.filter ?? {}))
      .limit(options.page.limit)
      .offset(options.page.offset)
      .orderBy(sortValues)
      .select();
  }

  async readRow(options: ReadRowOptions<T>): Promise<T> {
    const row = await db(this.table)
      .where(this.filter(options?.filter ?? {}))
      .first();

    if (options.failOrNull && row === undefined) {
      throw new QueryError({
        name: 'RowNotFound',
        message: 'Row Not Found',
      });
    }

    return row;
  }

  async readMeta(options: ReadMetaOptions<T>): Promise<ReadMetaResult> {
    return {
      page: {
        number: options.page.number,
        size: options.page.size,
      },
      total: await this.count({
        filter: options.filter,
      }),
    };
  }

  async count(options: CountOptions<T>): Promise<number> {
    return (
      (await db(this.table)
        .where(this.filter(options?.filter ?? {}))
        .count('* as total')
        .first()) as { total: number }
    ).total;
  }

  async exists(options: ExistsOptions<T>): Promise<boolean> {
    return !!(await this.count(options));
  }

  async create(options: CreateOptions<T>): Promise<T> {
    const [id] = await db(this.table).insert(options.values);

    return (await this.read({
      filter: {
        id,
      },
      first: true,
    })) as T;
  }

  async update(options: UpdateOptions<T>): Promise<T> {
    if (
      options.failOrNull &&
      !(await this.exists({ filter: options.filter }))
    ) {
      throw new QueryError({
        name: 'RowNotFound',
        message: 'RowNotFound',
      });
    }

    await db(this.table)
      .where(this.filter(options.filter))
      .update(options.values);

    return (await this.read({
      filter: options.filter,
      first: true,
    })) as T;
  }

  async store(options: StoreOptions<T>): Promise<T> {
    if (options.filter) {
      return await this.update({
        filter: options.filter,
        failOrNull: options.failOrNull,
        values: options.values,
      });
    }

    return await this.create({
      values: options.values,
    });
  }

  async delete(options: DeleteOptions<T>): Promise<void> {
    if (
      options.failOrNull &&
      !(await this.exists({ filter: options?.filter ?? {} }))
    ) {
      throw new QueryError({
        name: 'RowNotFound',
        message: 'RowNotFound',
      });
    }

    await db(this.table)
      .where(this.filter(options?.filter ?? {}))
      .delete();
  }
}
