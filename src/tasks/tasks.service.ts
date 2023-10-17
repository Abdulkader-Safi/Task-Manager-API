import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.model';
import { Tasks } from './tasks.entity';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks) private taskRepository: TaskRepository,
  ) {}

  async getTaskByID(id: string): Promise<Tasks> {
    const found = await this.taskRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with id:{${id}} not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Tasks> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete({
      id: id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id:{${id}} not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Tasks> {
    const task = await this.getTaskByID(id);

    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }
}
