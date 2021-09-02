
import fp from 'fastify-plugin'
import { KafkaClient as Client, KafkaClientOptions } from 'kafka-node';

import { kafkaConfig } from './config'

const kafkaPlugin = (async (server, opts, next) => {

    let config: KafkaClientOptions = kafkaConfig(server);
    const client = new Client(config);

    client.on('ready', () => {
        server.log.info('Kafka Client Connection has been established successfully.');
    });
    client.on('error', (err) => {
        server.apm.captureError(JSON.stringify({
            method: 'Kafka',
            err,
        }));

        server.log.info('Server not connected to Kafka');
    });

    // decorators
    server.decorate('kafkaClient', client);
});

export default fp(kafkaPlugin);