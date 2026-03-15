import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './database/data-source';
import { NotesModule } from './modules/notes/modules/notes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSource.options,
      autoLoadEntities: true,
      synchronize: false,
    }),
    NotesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
