import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NOTES_REPOSITORY } from './constants/constants';
import type { INotesRepository } from './interfaces/notes.repository.interface';
import { CreateNoteDto } from './dtos/create-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @Inject(NOTES_REPOSITORY)
    private readonly notesRepository: INotesRepository,
  ) {}

  getAllNotes() {
    return this.notesRepository.getAllNotes();
  }

  async createNote(options: CreateNoteDto) {
    return this.notesRepository.createNote({
      title: options.title,
      content: options.content,
    });
  }

  async getNoteById(id: string) {
    const note = await this.notesRepository.getNoteById(id);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }
}
