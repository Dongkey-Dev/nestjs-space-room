import { DataSource, DataSourceOptions } from 'typeorm';

let host;
let port;
let password;
let database;

if (process.env.NODE_ENV === 'prod') {
  host = process.env.PROD_DATABASE_HOST;
  port = process.env.PROD_DATABASE_PORT
    ? parseInt(process.env.PROD_DATABASE_PORT, 10)
    : 23306;
  password = process.env.PROD_DATABASE_PASSWORD;
  database = process.env.PROD_DATABASE_NAME;
} else {
  host = process.env.DEV_DATABASE_HOST;
  port = process.env.DEV_DATABASE_PORT
    ? parseInt(process.env.DEV_DATABASE_PORT, 10)
    : 33306;
  password = process.env.DEV_DATABASE_PASSWORD;
  database = process.env.DEV_DATABASE_NAME;
}

const options = {
  host: host,
  port: port,
  username: 'root',
  password: password,
  database: database,

  type: process.env.DATABASE_TYPE,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== 'prod',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'subscriber',
  },
  extra: {
    ssl:
      process.env.DATABASE_SSL_ENABLED === 'true'
        ? {
            rejectUnauthorized:
              process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
            ca: process.env.DATABASE_CA ?? undefined,
            key: process.env.DATABASE_KEY ?? undefined,
            cert: process.env.DATABASE_CERT ?? undefined,
          }
        : undefined,
  },
} as DataSourceOptions;
export default new DataSource(options);
