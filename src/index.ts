import { FastifyInstance } from "fastify";
import { createServer } from './server'

createServer()
  .then((server: any) => {
    server.log.info("Server started.");

  }).catch(error => {
    // do something
    console.log(error);
  });

