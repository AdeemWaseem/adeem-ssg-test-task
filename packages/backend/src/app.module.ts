import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { DBService } from './db/db.service';
import { DBModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DBModule,
    AuthModule,
    TasksModule,
    UsersModule,
  ],
  controllers: [],
  providers: [DBService],
})
export class AppModule {}
