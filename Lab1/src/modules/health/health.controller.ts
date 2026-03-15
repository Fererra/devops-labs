import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get('alive')
  alive(@Res() res: Response) {
    res.status(200).send('OK');
  }

  @Get('ready')
  async ready(@Res() res: Response) {
    try {
      await this.dataSource.query('SELECT 1');
      res.status(200).send('OK');
    } catch (e) {
      res.status(500).send('DB not ready');
    }
  }
}
