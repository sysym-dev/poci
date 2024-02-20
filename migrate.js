import 'dotenv/config';
import { pool } from './src/core/database/pool.js';

await pool.execute('DROP TABLE collections;');
await pool.execute('DROP TABLE users;');

await pool.execute(`
    CREATE TABLE users (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY (email)
    );
`);
await pool.execute(`
    CREATE TABLE collections (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
`);

process.exit();
