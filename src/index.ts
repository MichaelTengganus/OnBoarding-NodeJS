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

    server.redis.set('OnBoarding-NodeJS', 'Connected', "EX", server.conf.expireToken, (err, val) => {
      if (err) {
          server.log.info('Failed to establish Redis Connection.');
          server.log.error(JSON.stringify(err));
      } else {
          server.log.info('Redis Connection has been established successfully.');
      }
  });
  }).catch(error => {
    console.log(error);
  });

