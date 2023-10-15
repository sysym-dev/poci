import { db } from '../db';
import { Entity, EntityAttributes, EntityId } from '../entity';
import { parsePaginate } from '../paginate';
import {
  ReadMetaOptions,
  ReadMetaResult,
  ReadOptions,
  ReadResult,
  ReadRowsOptions,
} from './contract';

export abstract class Repository<T extends Entity> {
  abstract table: string;

  async read(options?: ReadOptions): Promise<ReadResult<T>> {
    const page = parsePaginate(options?.page?.size, options?.page?.number);

    return {
      meta: await this.readMeta({
        page: {
          size: page.limit,
          number: page.number,
        },
      }),
      rows: await this.readRows({
        page: {
          limit: page.limit,
          offset: page.offset,
        },
      }),
    };
  }

  async readRows(options: ReadRowsOptions): Promise<T[]> {
    return await db(this.table)
      .limit(options.page.limit)
      .offset(options.page.offset)
      .select();
  }

  async readMeta(options: ReadMetaOptions): Promise<ReadMetaResult> {
    return {
      page: {
        number: options.page.number,
        size: options.page.size,
      },
      total: await this.count(),
    };
  }

  async count(): Promise<number> {
    return (
      (await db(this.table).count('* as total').first()) as { total: number }
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
