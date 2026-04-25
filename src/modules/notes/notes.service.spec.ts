import { NotFoundException } from '@nestjs/common';
import { NOTES_REPOSITORY } from './constants/constants';
import { Note } from './entities/note.entity';
import { INotesRepository } from './interfaces/notes.repository.interface';
import { NotesService } from './notes.service';

function createRepo() {
  const getAllNotes = jest.fn<Promise<Note[]>, []>();
  const createNote = jest.fn<Promise<Note>, [Partial<Note>]>();
  const getNoteById = jest.fn<Promise<Note | null>, [string]>();

  return {
    repo: {
      getAllNotes,
      createNote,
      getNoteById,
    } as jest.Mocked<INotesRepository>,
    getAllNotes,
    createNote,
    getNoteById,
  };
}

describe('NotesService', () => {
  it('passes through getAllNotes', async () => {
    const { repo, getAllNotes } = createRepo();
    const service = new NotesService(repo);
    getAllNotes.mockResolvedValue([]);

    const result = await service.getAllNotes();

    expect(result).toEqual([]);
    expect(getAllNotes).toHaveBeenCalledTimes(1);
  });

  it('createNote maps DTO fields', async () => {
    const { repo, createNote } = createRepo();
    const service = new NotesService(repo);
    const created = {
      id: 'id-1',
      title: 't',
      content: 'c',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    } as Note;
    createNote.mockResolvedValue(created);

    const result = await service.createNote({ title: 't', content: 'c' });

    expect(createNote).toHaveBeenCalledWith({ title: 't', content: 'c' });
    expect(result).toBe(created);
  });

  it('getNoteById returns note when found', async () => {
    const { repo, getNoteById } = createRepo();
    const service = new NotesService(repo);
    const note = {
      id: 'id-2',
      title: 'tt',
      content: 'cc',
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
    } as Note;
    getNoteById.mockResolvedValue(note);

    await expect(service.getNoteById('id-2')).resolves.toBe(note);
    expect(getNoteById).toHaveBeenCalledWith('id-2');
  });

  it('getNoteById throws NotFoundException when missing', async () => {
    const { repo, getNoteById } = createRepo();
    const service = new NotesService(repo);
    getNoteById.mockResolvedValue(null);

    await expect(service.getNoteById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('uses NOTES_REPOSITORY injection token', () => {
    // Ensures the DI token constant is actually referenced by tests.
    expect(NOTES_REPOSITORY).toBe('NOTES_REPOSITORY');
  });
});
