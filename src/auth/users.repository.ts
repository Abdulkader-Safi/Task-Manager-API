import { Repository } from 'typeorm';
import { Users } from './users.entity';

export class UsersRepository extends Repository<Users> {}
