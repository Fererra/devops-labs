import { DataSource } from 'typeorm';
import { Note } from '../modules/notes/entities/note.entity';
import { getArg } from '../common/util/get-arg.util';

export default new DataSource({
  type: 'mariadb',
  host: getArg('db-host'),
  port: Number(getArg('db-port')),
  username: getArg('db-user'),
  password: getArg('db-password'),
  database: getArg('db-name'),
  entities: [Note],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
