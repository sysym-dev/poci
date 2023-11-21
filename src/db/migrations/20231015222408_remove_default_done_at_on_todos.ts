import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('todos', (table) => {
    table.string('name').notNullable().alter();
    table.timestamp('done_at').nullable().defaultTo(null).alter();
  });
}

export async function down(knex: Knex): Promise<void> {}
