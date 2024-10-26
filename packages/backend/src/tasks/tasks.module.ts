import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DBService } from '../db/db.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, DBService],
})
export class TasksModule {}
