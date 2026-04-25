import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Headers,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dtos/create-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getAllNotes(@Headers('accept') accept: string, @Res() res: Response) {
    const notes = await this.notesService.getAllNotes();

    if (accept?.includes('text/html')) {
      const rows = notes
        .map((n) => `<tr><td>${n.id}</td><td>${n.title}</td></tr>`)
        .join('');

      const html = `
        <html>
        <body>
          <h1>Notes</h1>
          <table border="1">
            <tr>
              <th>ID</th>
              <th>Title</th>
            </tr>
            ${rows}
          </table>
        </body>
        </html>
      `;

      return res.type('text/html').send(html);
    }

    return res.json(notes);
  }

  @Post()
  async createNote(
    @Body() dto: CreateNoteDto,
    @Headers('accept') accept: string,
    @Res() res: Response,
  ) {
    const note = await this.notesService.createNote(dto);

    if (accept?.includes('text/html')) {
      const html = `
        <html>
        <body>
          <h1>Note created</h1>
          <p>ID: ${note.id}</p>
          <p>Title: ${note.title}</p>
        </body>
        </html>
      `;

      return res.type('text/html').send(html);
    }

    return res.json({ message: 'Note created successfully', id: note.id });
  }

  @Get(':id')
  async getNoteById(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('accept') accept: string,
    @Res() res: Response,
  ) {
    const note = await this.notesService.getNoteById(id);

    console.log(note);

    if (accept?.includes('text/html')) {
      const html = `
        <html>
        <body>
          <h1>${note.title}</h1>
          <p>${note.content}</p>
          <p>created_at: ${note.createdAt.toISOString()}</p>
        </body>
        </html>
      `;

      return res.type('text/html').send(html);
    }

    return res.json(note);
  }
}
