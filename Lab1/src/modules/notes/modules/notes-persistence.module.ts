import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from '../entities/note.entity';
import { NOTES_REPOSITORY } from '../constants/constants';
import { NotesRepository } from '../repository/notes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [{ provide: NOTES_REPOSITORY, useClass: NotesRepository }],
  exports: [NOTES_REPOSITORY],
})
export class NotesPersistenceModule {}
