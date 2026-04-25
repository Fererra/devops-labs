import { Note } from '../entities/note.entity';
import { NotesRepository } from './notes.repository';

describe('NotesRepository', () => {
  it('getAllNotes delegates to find with selected fields', async () => {
    const find = jest.fn().mockResolvedValue([]);
    const ormRepo = { find };
    const repo = new NotesRepository(ormRepo as never);

    await repo.getAllNotes();

    expect(find).toHaveBeenCalledWith({ select: ['id', 'title'] });
  });

  it('createNote delegates to save', async () => {
    const note = {
      id: 'n1',
      title: 't',
      content: 'c',
      createdAt: new Date('2026-03-01T00:00:00.000Z'),
    } as Note;
    const save = jest.fn().mockResolvedValue(note);
    const ormRepo = { save };
    const repo = new NotesRepository(ormRepo as never);

    const result = await repo.createNote({ title: 't', content: 'c' });

    expect(save).toHaveBeenCalledWith({ title: 't', content: 'c' });
    expect(result).toBe(note);
  });

  it('getNoteById delegates to findOneBy', async () => {
    const note = {
      id: 'n2',
      title: 'tt',
      content: 'cc',
      createdAt: new Date('2026-03-02T00:00:00.000Z'),
    } as Note;
    const findOneBy = jest.fn().mockResolvedValue(note);
    const ormRepo = { findOneBy };
    const repo = new NotesRepository(ormRepo as never);

    const result = await repo.getNoteById('n2');

    expect(findOneBy).toHaveBeenCalledWith({ id: 'n2' });
    expect(result).toBe(note);
  });
});
