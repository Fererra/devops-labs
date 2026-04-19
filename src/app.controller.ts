import { Controller, Get, Headers, Res, HttpException } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  root(@Headers('accept') accept: string, @Res() res: Response) {
    if (!accept?.includes('text/html')) {
      throw new HttpException('HTML only', 406);
    }

    const html = `
      <html>
      <body>
        <h1>mywebapp API</h1>
        <ul>
          <li>GET /notes</li>
          <li>POST /notes</li>
          <li>GET /notes/:id</li>
          <li>GET /health/alive</li>
          <li>GET /health/ready</li>
        </ul>
      </body>
      </html>
    `;

    res.type('text/html').send(html);
  }
}
