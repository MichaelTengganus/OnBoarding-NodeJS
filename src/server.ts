import { fastify } from 'fastify';
import fastifyBlipp from "fastify-blipp";
import fastifySwagger from "fastify-swagger";
import AutoLoad from "fastify-autoload";
import * as path from "path";
import * as dotenv from 'dotenv';
import { swagger } from './config/index';
import dbPlugin from './plugins/db';

import kafkaPlugin from './plugins/kafka';
import apmServer from 'elastic-apm-node';

import fastifyJwt from "fastify-jwt";
import fastifyAuth from "fastify-auth";

import redisPlugin from './plugins/redis';

dotenv.config({
    path: path.resolve('.env'),
});

// configuration
const port: any = process.env.PORT;
const dbDialect: string = process.env.DB_DIALECT;
const db: string = process.env.DB;
const dbHost: string = process.env.DB_HOST;
const dbPort: any = process.env.DB_PORT;
const dbUsername: string = process.env.DB_USERNAME;
const dbPassword: string = process.env.DB_PASSWORD;

const apmUrl: string = process.env.APM_URL
const kafkaHost: string = process.env.KAFKA_HOST;

const secretKey: string = process.env.SECRET;
const expireToken = process.env.EXPIRE_TOKEN;

const redistHost: string = process.env.REDIS_HOST;
const redisPort: any = process.env.REDIS_PORT;
const redisPassword: string = process.env.REDIS_PASSWORD;

// set APM service
var apm = apmServer.start({
    serviceName: 'apm-server',
    serverUrl: apmUrl,
    environment: 'development',
})

export const createServer = () => new Promise((resolve, reject) => {

    const server = fastify({
        ignoreTrailingSlash: true,
        logger: {
            prettyPrint: true,
            level: "info",

        },
        bodyLimit: 15000 * 1024,
        pluginTimeout: 12000
    });

    //-----------------------------------------------------
    // register plugin below:
    server.register(fastifyBlipp);

    // swagger / open api
    server.register(fastifySwagger, swagger.options);
    server.register(fastifyJwt, { secret: secretKey })
    server.register(fastifyAuth)

    // auto register all routes
    server.register(AutoLoad, {
        dir: path.join(__dirname, 'modules/routes')
    });

    //-----------------------------------------------------
    // decorators
    server.decorate('conf', {
        port, dbDialect, db, dbHost, dbPort, dbUsername, dbPassword, kafkaHost, apmUrl,
        secretKey, expireToken, redistHost, redisPort, redisPassword
    });
    server.decorate('apm', apmServer);

    // plugin
    server.register(dbPlugin);
    server.register(kafkaPlugin);
    server.register(redisPlugin);

    // add request onRequest
    server.addHook('onRequest', async (request, reply, error) => {
        apm.setTransactionName(request.method + ' ' + request.url);
    });

    // global hook error handling for unhandled error
    server.addHook('onError', async (request, reply, error) => {
        const { message, stack } = error;
        let err = {
            method: request.routerMethod,
            path: request.routerPath,
            param: request.body,
            message,
            stack
        };
        apm.captureError(JSON.stringify(err));
    });

    // main
    const start = async () => {
        try {
            await server.listen(port);
            server.blipp();
            server.log.info(`server listening on ${JSON.stringify(server.server.address())}`);
            resolve(server);
        } catch (err) {
            server.log.error(err);
            reject(err);
            process.exit(1);
        }
    };
    start();
});