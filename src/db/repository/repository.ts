import { Knex } from 'knex';
import { db } from '../db';
import { Entity, EntityAttributes, EntityId } from '../entity';
import { parsePaginate } from '../paginate';
import {
  CountOptions,
  ReadMetaOptions,
  ReadMetaResult,
  ReadOptions,
  ReadResult,
  ReadRowOptions,
  ReadRowsOptions,
} from './contract';
import { QueryError } from '../errors/query.error';

export abstract class Repository<T extends Entity> {
  abstract table: string;

  abstract filter(values: Record<string, any>): Knex.QueryCallback;

  async read(options?: ReadOptions): Promise<ReadResult<T>> {
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

  async readRows(options: ReadRowsOptions): Promise<T[]> {
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

  async readRow(options: ReadRowOptions): Promise<T> {
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

  async readMeta(options: ReadMetaOptions): Promise<ReadMetaResult> {
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

  async count(options: CountOptions): Promise<number> {
    return (
      (await db(this.table)
        .where(this.filter(options?.filter ?? {}))
        .count('* as total')
        .first()) as { total: number }
    ).total;
  }

  async store(id: EntityId | null, todo: Partial<EntityAttributes<T>>) {
    if (id) {
      await db(this.table).where('id', id).update(todo);
    } else {
      await db(this.table).insert(todo);
    }
  }
}
