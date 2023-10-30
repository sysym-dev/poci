import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('todos', (table) => {
    table.timestamp('due_at').notNullable().after('name');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('todos', (table) => {
    table.dropColumn('due_at');
  });
}
