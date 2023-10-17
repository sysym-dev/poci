import '../../env';

import { program } from 'commander';
import { db } from './db';
import { resolve } from 'path';
import { execute } from '../app/helpers/execute';

const migrationDirectory = resolve(__dirname, 'migrations');

program
  .command('make:migration')
  .argument('<name>')
  .action(async (name: string) => {
    await execute(async () => {
      await db.migrate.make(name, {
        directory: migrationDirectory,
        extension: 'ts',
      });
    }, 'migration created');
  });

program.command('migrate').action(async () => {
  await execute(async () => {
    await db.migrate.latest({
      directory: migrationDirectory,
      extension: 'ts',
    });
  }, 'migrated');
});

program.command('migrate:rollback').action(async () => {
  await execute(async () => {
    await db.migrate.rollback({
      directory: migrationDirectory,
      extension: 'ts',
    });
  }, 'rollback');
});

program.parse();
