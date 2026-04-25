import { Note } from './entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

type MockResponse = {
  json: jest.MockedFunction<(body: unknown) => MockResponse>;
  send: jest.MockedFunction<(body: string) => MockResponse>;
  type: jest.MockedFunction<(contentType: string) => MockResponse>;
};

function createResponse(): MockResponse {
  const res = {
    json: jest.fn<(body: unknown) => MockResponse>(),
    send: jest.fn<(body: string) => MockResponse>(),
    type: jest.fn<(contentType: string) => MockResponse>(),
  } as MockResponse;

  res.json.mockReturnValue(res);
  res.send.mockReturnValue(res);
  res.type.mockReturnValue(res);

  return res;
}

function createNote(id: string): Note {
  return {
    id,
    title: `title-${id}`,
    content: `content-${id}`,
    createdAt: new Date('2026-02-01T10:00:00.000Z'),
  } as Note;
}

describe('NotesController', () => {
  let service: jest.Mocked<NotesService>;
  let controller: NotesController;

  beforeEach(() => {
    service = {
      getAllNotes: jest.fn(),
      createNote: jest.fn(),
      getNoteById: jest.fn(),
    } as unknown as jest.Mocked<NotesService>;

    controller = new NotesController(service);
  });

  it('getAllNotes returns json by default', async () => {
    const notes = [createNote('1')];
    service.getAllNotes.mockResolvedValue(notes);
    const res = createResponse();

    await controller.getAllNotes('application/json', res as never);

    expect(res.json).toHaveBeenCalledWith(notes);
  });

  it('getAllNotes returns html when accept is text/html', async () => {
    const notes = [createNote('2')];
    service.getAllNotes.mockResolvedValue(notes);
    const res = createResponse();

    await controller.getAllNotes('text/html', res as never);

    expect(res.type).toHaveBeenCalledWith('text/html');
    expect(res.send).toHaveBeenCalled();
    const html = res.send.mock.calls[0]?.[0] ?? '';
    expect(html).toContain('<h1>Notes</h1>');
    expect(html).toContain('title-2');
  });

  it('createNote returns json by default', async () => {
    const note = createNote('3');
    service.createNote.mockResolvedValue(note);
    const res = createResponse();

    await controller.createNote(
      { title: 't', content: 'c' },
      'application/json',
      res as never,
    );

    expect(res.json).toHaveBeenCalledWith({
      message: 'Note created successfully',
      id: note.id,
    });
  });

  it('createNote returns html when accept is text/html', async () => {
    const note = createNote('4');
    service.createNote.mockResolvedValue(note);
    const res = createResponse();

    await controller.createNote(
      { title: 't', content: 'c' },
      'text/html',
      res as never,
    );

    expect(res.type).toHaveBeenCalledWith('text/html');
    expect(res.send).toHaveBeenCalled();
    const html = res.send.mock.calls[0]?.[0] ?? '';
    expect(html).toContain('<h1>Note created</h1>');
    expect(html).toContain(note.id);
  });

  it('getNoteById returns json by default', async () => {
    const note = createNote('5');
    service.getNoteById.mockResolvedValue(note);
    const res = createResponse();

    await controller.getNoteById(note.id, 'application/json', res as never);

    expect(res.json).toHaveBeenCalledWith(note);
  });

  it('getNoteById returns html when accept is text/html', async () => {
    const note = createNote('6');
    service.getNoteById.mockResolvedValue(note);
    const res = createResponse();

    await controller.getNoteById(note.id, 'text/html', res as never);

    expect(res.type).toHaveBeenCalledWith('text/html');
    expect(res.send).toHaveBeenCalled();
    const html = res.send.mock.calls[0]?.[0] ?? '';
    expect(html).toContain(note.title);
    expect(html).toContain(note.content);
    expect(html).toContain(note.createdAt.toISOString());
  });
});
