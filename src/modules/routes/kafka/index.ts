import fp from 'fastify-plugin';

import { PublishKafkaTO, SubscribeKafkaTO, TopicKafkaTO } from './schema';
import { kafkaSubscribe } from '../../../plugins/kafka/consumer';
import { createTopic, publish } from '../../../plugins/kafka/producer';

//import { kafkaJSSubscribe } from '../../../plugins/kafkaJS/consumer';
//import { kafkaJSpublish } from '../../../plugins/kafkaJS/producer';


export default fp((server, opts, next) => {

    server.post("/kafka/subscribe", { schema: SubscribeKafkaTO }, (request, reply) => {
        try {
            const { topic } = request.body;
            let count = 0;
            let data = [];

            kafkaSubscribe(server.kafkaClient, topic, (messages) => {
                count++;
                data.push(messages);

                if (count == messages.highWaterOffset) {
                    return reply.code(200).send({
                        success: true,
                        message: 'Inquiry successful!',
                        data
                    });
                }
            });
            data = [];

        } catch (error) {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error,
            })

            request.log.error(error);
            return reply.send(400);
        }
    });


    server.post("/kafka/publish", { schema: PublishKafkaTO }, (request, reply) => {
        const { topic, messages } = request.body;

        publish(server.kafkaClient, topic, messages).then((response) => {
            return reply.code(200).send({
                success: true,
                message: 'Send message successful!',
                data: response
            });
        }).catch((error) => {
            server.apm.captureError(JSON.stringify({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error,
            }))

            return reply.code(400).send({
                success: true,
                message: 'Send message failed!',
                data: error
            });
        });
    });

    server.post("/kafka/createTopic", { schema: TopicKafkaTO }, (request, reply) => {
        const { topics } = request.body;

        createTopic(server.kafkaClient, topics).then((response) => {
            return reply.code(200).send({
                success: true,
                message: 'Create topic successful!',
                data: response
            });
        }).catch((error) => {
            server.apm.captureError({
                method: request.routerMethod,
                path: request.routerPath,
                param: request.body,
                error,
            })

            return reply.code(400).send({
                success: true,
                message: 'Create topic failed!',
                data: error
            });
        });
    });

    next();
});