import { DataSource, DataSourceOptions } from 'typeorm';
import * as process from 'node:process';

let dbOptions = {
    type: 'sqlite',
    database: '',
    entities: [],
    migrations: ['dist/db/migrations/*.js'],
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbOptions, {
            type: 'sqlite',
            database: 'dev-db.sqlite',
            entities: ['**/*.entity.js'],
        });
        break;
    case 'test':
        Object.assign(dbOptions, {
            type: 'sqlite',
            database: 'test-db.sqlite',
            entities: ['**/*.entity.ts'],
            migrationsRun: true
        });
        break;
    case 'production':
        Object.assign(dbOptions, {
            type: 'postgres',
            // will be set by heroku
            url: process.env.DATABASE_URL,
            // run migrations on launch to prod
            migrationsRun: true,
            entities: ['**/*.entity.js'],
            ssl: {
                rejectUnauthorized: false,
            },
        });
        break;
    default:
        throw new Error('Unknown environment');
}

export const dataSourceOptions: DataSourceOptions = dbOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

// npm run migration:generate db/migrations/initial-schema
// npm run migration:run