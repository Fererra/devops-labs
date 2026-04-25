import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getArg } from './common/util/get-arg.util';

type SystemdSocketServer = {
  listen: (options: { fd: number }, callback: () => void) => void;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.LISTEN_FDS && parseInt(process.env.LISTEN_FDS) > 0) {
    const httpServer = app.getHttpServer() as SystemdSocketServer;

    httpServer.listen({ fd: 3 }, () => {
      console.log('Started via systemd socket activation');
    });

    await app.init();
  } else {
    const port = getArg('port');

    await app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
void bootstrap();
