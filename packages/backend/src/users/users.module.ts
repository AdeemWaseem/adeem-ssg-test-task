import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DBService } from '../db/db.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DBService],
})
export class UsersModule {}
