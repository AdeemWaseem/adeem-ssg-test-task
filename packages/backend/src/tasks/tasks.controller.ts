import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks() {
    return this.tasksService.getTasks();
  }

  @Post()
  async createTask(
    @Body()
    taskData: {
      task_name: string;
      description: string;
      shared_with: number[];
    },
  ) {
    return this.tasksService.createTask(taskData);
  }

  @Put(':id')
  async updateTask(
    @Param('id') taskId: number,
    @Body()
    taskData: {
      task_name?: string;
      description?: string;
      shared_with?: number[];
    },
  ) {
    return this.tasksService.updateTask(taskId, taskData);
  }

  @Delete(':id')
  async deleteTask(@Param('id') taskId: number) {
    return this.tasksService.deleteTask(taskId);
  }
}
