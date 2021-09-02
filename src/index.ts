import { FastifyInstance } from "fastify";
import { createServer } from './server'

createServer()
  .then((server: any) => {
    server.log.info("Server started.");

    const apmServerStatus = server.apm.isStarted();
    if (apmServerStatus) {
      server.log.info('APM Server Connection has been established successfully.');
    } else {
      server.log.info('Server not connected to APM Server');
    }
  }).catch(error => {
    console.log(error);
  });

