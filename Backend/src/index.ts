import * as dotenv from 'dotenv';
dotenv.config();
import {ApplicationConfig, MyLoopbackAppApplication} from './application';

export * from './application';

if (require.main === module) {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? 8080),
      host: '127.0.0.1',
      cors: {
        origin: [
          'http://localhost:3001',
          'http://localhost:3000',
          'http://127.0.0.1:3000',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
  };

  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}

export async function main(options: ApplicationConfig = {}) {
  const app = new MyLoopbackAppApplication(options);

  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
