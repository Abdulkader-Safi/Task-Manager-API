import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTaskFilterDto } from './dto/getTaskFilter.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
    // if we have any filters defined, call tasksService,getTasksWithFilters
    // otherwise, just get all tasks
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTaskWithFilter(filterDto);
    }

    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/title')
  updateTaskTitle(@Param('id') id: string, @Body('title') title: string): Task {
    return this.tasksService.updateTaskTitle(id, title);
  }

  @Patch('/:id/description')
  updateTaskDescription(
    @Param('id') id: string,
    @Body('description') description: string,
  ): Task {
    return this.tasksService.updateTaskDescription(id, description);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }
}
