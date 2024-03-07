import 'dotenv/config';
import { pool } from '../core/database/pool.js';

await pool.execute('DROP TABLE IF EXISTS activities');
await pool.execute('DROP TABLE IF EXISTS collection_items;');
await pool.execute('DROP TABLE IF EXISTS collections;');
await pool.execute('DROP TABLE IF EXISTS users;');

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
await pool.execute(`
    CREATE TABLE collection_items (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        collection_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        is_done BOOLEAN NOT NULL DEFAULT FALSE,
        PRIMARY KEY (id),
        FOREIGN KEY (collection_id)
            REFERENCES collections (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )
`);
await pool.execute(`
    CREATE TABLE activities (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        due_at DATETIME NOT NULL,
        is_done BOOLEAN NOT NULL DEFAULT FALSE,
        is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
        user_id INT UNSIGNED NOT NULL,
        collection_item_id INT UNSIGNED NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        FOREIGN KEY (collection_item_id)
            REFERENCES collection_items (id)
            ON UPDATE CASCADE
            ON DELETE CASCADE
    )
`);

process.exit();
