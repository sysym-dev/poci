import { Server } from './src/server/server';

const server = new Server();

server.listen((port: number) => {
  console.log(`Server listening at ${port}`);
});
