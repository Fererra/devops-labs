import { InjectRepository } from '@nestjs/typeorm';
import { INotesRepository } from '../interfaces/notes.repository.interface';
import { Note } from '../entities/note.entity';
import { Repository } from 'typeorm';

export class NotesRepository implements INotesRepository {
  constructor(
    @InjectRepository(Note) private readonly repository: Repository<Note>,
  ) {}

  getAllNotes(): Promise<Note[]> {
    return this.repository.find({ select: ['id', 'title'] });
  }

  createNote(data: Partial<Note>): Promise<Note> {
    return this.repository.save(data);
  }

  getNoteById(id: string): Promise<Note | null> {
    return this.repository.findOneBy({ id });
  }
}
