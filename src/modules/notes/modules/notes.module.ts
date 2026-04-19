import { Module } from '@nestjs/common';
import { NotesService } from '../notes.service';
import { NotesController } from '../notes.controller';
import { NotesPersistenceModule } from './notes-persistence.module';

@Module({
  imports: [NotesPersistenceModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
