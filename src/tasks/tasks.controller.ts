import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { Users } from '../auth/users.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.model';
import { Tasks } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  private logger = new Logger('TasksController', { timestamp: true });

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: Users,
  ): Promise<Tasks[]> {
    this.logger.verbose(
      `User {${user.username}} retrieving all tasks. Filter: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: Users): Promise<Tasks> {
    this.logger.verbose(`User {${user.username}} searched for task {${id}}`);
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: Users,
  ): Promise<Tasks> {
    this.logger.verbose(`User {${user.username}} created new task`);
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @GetUser() user: Users,
  ): Promise<Tasks> {
    this.logger.verbose(
      `User {${user.username}} updated task with id: {${id}}`,
    );
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: Users): Promise<void> {
    this.logger.verbose(
      `User {${user.username}} deleted task with id: {${id}}`,
    );
    return this.tasksService.deleteTask(id, user);
  }
}
