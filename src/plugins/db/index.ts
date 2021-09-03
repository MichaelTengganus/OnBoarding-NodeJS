import fp from 'fastify-plugin'
import * as dbSequel from "sequelize";
// import { ShirtFactory } from './models/shirt';
// import { UserFactory } from './models/user';

const dbPlugin = (async (server/*, opts, next*/) => {

    // database
    const dbSequelize = new dbSequel.Sequelize(server.conf.db, server.conf.dbUsername, server.conf.dbPassword, {
        // other sequelize config goes here
        dialect: "mssql",
        host: server.conf.dbHost,
        port: Number.parseInt(server.conf.dbPort),
        dialectOptions: {
            options: { encrypt: true }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    });

    // decorators
    server.decorate('db', dbSequelize);

    server.addHook('onClose', (fastifyInstance, done) => {
        dbSequelize.close()
            .then(() => done())
            .catch((error) => {
                const { message, stack } = error;
                const err = {
                    method: 'DB Connection Closing',
                    message,
                    stack
                };

                server.apm.captureError(JSON.stringify(err));
                done()
            });
    });

    server.log.info('Checking Connection.');
    server.db
        .authenticate()
        .then(async () => {
            server.log.info('Database Connection has been established successfully.');
        })
        .catch(err => {
            server.apm.captureError({
                method: "Connecting to database",
                error: err,
            })

            server.log.error('Unable to connect to the database:', err);
        });

    // const shirt = ShirtFactory(dbSequelize)
    // export const User = UserFactory(dbSequelize);

    server.db.sync();

});

export default fp(dbPlugin);