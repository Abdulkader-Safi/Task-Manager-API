import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { Users } from '../auth/users.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.model';
import { Tasks } from './tasks.entity';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService', { timestamp: true });

  constructor(
    @InjectRepository(Tasks) private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: Users): Promise<Tasks[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('tasks');
    query.where({ user });

    if (status) {
      query.andWhere('(tasks.status = :status)', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(tasks.title) LIKE LOWER(:search) OR LOWER(tasks.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${
          user.username
        }. Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: Users): Promise<Tasks> {
    // FIXME: Not working
    const found = await this.taskRepository.findOne({
      where: {
        id: id,
        user: user,
      },
    });

    log(found);

    if (!found) {
      this.logger.error(
        `Failed to get task for user ${user.username} with id {${id}}`,
      );
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: Users): Promise<Tasks> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);
    return task;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: Users,
  ): Promise<Tasks> {
    const task = await this.getTaskById(id, user);

    try {
      task.status = status;
      await this.taskRepository.save(task);

      return task;
    } catch (error) {
      this.logger.error(
        `Failed to update task {${id}} by user ${user.username} `,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async deleteTask(id: string, user: Users): Promise<void> {
    const result = await this.taskRepository.delete({
      id: id,
      user: user,
    });

    if (result.affected === 0) {
      this.logger.error(
        `Failed to delete task {${id}} by user ${user.username}. Task Not found.`,
      );
      throw new NotFoundException(`Task with id:{${id}} not found`);
    }
  }
}
