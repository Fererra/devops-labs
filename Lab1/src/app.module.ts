import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './database/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSource.options,
      autoLoadEntities: true,
      synchronize: false,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
