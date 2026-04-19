import { Note } from '../entities/note.entity';

export interface INotesRepository {
  getAllNotes(): Promise<Note[]>;
  createNote(data: Partial<Note>): Promise<Note>;
  getNoteById(id: string): Promise<Note | null>;
}
