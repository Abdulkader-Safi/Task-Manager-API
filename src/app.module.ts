import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      database: 'task-management',
      port: 5432,
      username: 'postgres',
      password: 'Safi@2020',
      autoLoadEntities: true,
      synchronize: true,
      // entities: ['dist/**/*.entity.js'],
    }),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
