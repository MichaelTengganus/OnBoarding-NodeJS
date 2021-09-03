import fp from 'fastify-plugin'
import fastifyRedis from "fastify-redis";

const redisPlugin = (async (server, opts, next) => {
    const config = {
        host: server.conf.redistHost,
        port: server.conf.redisPort,
        password: server.conf.redisPassword,
        closeClient: true,
        tls:true
    };

    server.register(fastifyRedis, config);
});
export default fp(redisPlugin);