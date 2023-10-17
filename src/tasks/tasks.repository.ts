import { Repository } from 'typeorm';
import { Tasks } from './tasks.entity';

export class TaskRepository extends Repository<Tasks> {}
