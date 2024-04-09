import { Global, Module } from '@nestjs/common';
import { mysqlProvider } from './database.provider';

@Global()
@Module({
  providers: [mysqlProvider],
  exports: [mysqlProvider],
})
export class DatabaseModule {}
