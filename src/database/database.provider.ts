import { DataSource, getMetadataArgsStorage } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const mysqlProvider = {
  provide: 'DATA_SOURCE',
  useFactory: async () => {
    let config = {};
    if (process.env.NODE_ENV !== 'prod') {
      config = {
        host: process.env.DEV_DATABASE_HOST,
        port: +process.env.DEV_DATABASE_PORT,
        username: 'root',
        password: process.env.DEV_DATABASE_PASSWORD,
        database: 'space',
      };
    } else {
      config = {
        host: process.env.PROD_DATABASE_HOST,
        port: +process.env.PROD_DATABASE_PORT,
        username: 'root',
        password: process.env.PROD_DATABASE_PASSWORD,
        database: 'space',
      };
    }
    const dataSource = new DataSource({
      type: 'mysql',
      ...config,
      entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
      namingStrategy: new SnakeNamingStrategy(),
      logging: false,
      synchronize: false,
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    });
    return dataSource.initialize();
  },
};
