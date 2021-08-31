import { fastify } from 'fastify';
import fastifyBlipp from "fastify-blipp";
import fastifySwagger from "fastify-swagger";
import AutoLoad from "fastify-autoload";
import * as path from "path";
import * as dotenv from 'dotenv';
import { swagger } from './config/index';
import dbPlugin from './plugins/db';

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

    // auto register all routes
    server.register(AutoLoad, {
        dir: path.join(__dirname, 'modules/routes')
    });

    server.get('/', async (request, reply) => {
        return {
            hello: 'world'
        };
    });

    //apm
    //-----------------------------------------------------
    // decorators
    server.decorate('conf', { port, dbDialect, db, dbHost, dbPort, dbUsername, dbPassword });

    // plugin
    server.register(dbPlugin);

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