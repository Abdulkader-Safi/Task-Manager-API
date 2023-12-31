import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.model';

export class GetTaskFilterDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
